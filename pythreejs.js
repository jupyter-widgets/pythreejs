// we do this so it works in IPython or the sage cell server
var require = require || sagecell.require;
var requirejs = requirejs || sagecell.requirejs
var define = define || sagecell.define;

requirejs.config({
  paths: {
        'threejs': 'https://raw2.github.com/jasongrout/three.js/sagecell/build/three.min',
        'threejs-trackball': 'https://raw2.github.com/jasongrout/three.js/sagecell/examples/js/controls/TrackballControls',
        'threejs-orbit': 'https://raw2.github.com/jasongrout/three.js/sagecell/examples/js/controls/OrbitControls',
        'threejs-detector': 'https://raw2.github.com/jasongrout/three.js/sagecell/examples/js/Detector',
  },
  shim: {
    'threejs': {exports: 'THREE'},
    'threejs-trackball': {exports: 'THREE.TrackballControls',
                          deps: ['threejs']},
    'threejs-orbit': {exports: 'THREE.OrbitControls',
                      deps: ['threejs']},
    'threejs-detector': {exports: 'Detector'},
  },
    waitSeconds: 20,
});
define("threejs-all", ["threejs-trackball", "threejs-orbit", "threejs-detector"], function() {console.log('three.js loaded')});

require(["threejs-all", "notebook/js/widgets/widget"], function() {
    var RendererView = IPython.DOMWidgetView.extend({
        render : function(){
            console.log('created renderer');
            var width = this.model.get('width');
            var height = this.model.get('height');
            if ( Detector.webgl )
                this.renderer = new THREE.WebGLRenderer( {antialias:true} );
            else
                this.renderer = new THREE.CanvasRenderer();
            this.renderer.setSize( width, height);
            this.$el.empty().append( this.renderer.domElement );
            this.camera = this.create_child_view(this.model.get('camera'));
            this.scene = this.create_child_view(this.model.get('scene'));
            this.scene.obj.add(this.camera.obj);
            console.log('renderer', this.model, this.scene.obj, this.camera.obj);
            this.update();
            var that = this;
            this.controls = this.create_child_view(this.model.get('controls'), {dom: this.renderer.domElement,
                                                                         update: function(fn, context) {
                                                                                    that.on('render:update', fn, context);
                                                                                 }
                                                                        })
            this.animate();
            window.r = this;
        },
        animate: function() {
            requestAnimationFrame( _.bind(this.animate, this) );
            this.trigger('render:update');
            this.renderer.render(this.scene.obj, this.camera.obj);
        },
        update : function(){
            console.log('update renderer', this.scene.obj, this.camera.obj);
            return IPython.DOMWidgetView.prototype.update.call(this);
        },
    });

    IPython.WidgetManager.register_widget_view('RendererView', RendererView);

    var ThreeView = IPython.WidgetView.extend({
        initialize: function () {
            IPython.WidgetView.prototype.initialize.apply(this, arguments);
            this.new_properties();
        },

        render: function() {
            this.obj = this.new_obj();
            this.update()
            return this.obj;
        },
        new_properties: function() {
            // initialize properties arrays
            this.array_properties = [];
            this.scalar_properties = [];
            this.enum_properties = [];
            this.set_properties = []; // properties we set using the set method
            // TODO: handle submodel properties?
        },
        update: function() {
            //this.replace_obj(this.new_obj());
            this.update_object_parameters();
            this.needs_update();
        },

        replace_obj: function(new_obj) {
            var old_obj = this.obj;
            this.obj = new_obj;
            this.trigger('replace_obj', old_obj, new_obj);
        },
        new_obj: function() {
        },

        needs_update: function() {
        },
        update_object_parameters: function() {
            var array_properties = this.array_properties;
            for (var p_index=0,len=array_properties.length; p_index<len; p_index++) {
                var p = array_properties[p_index];
                var prop = this.model.get(p)
                if (prop.length !== 0) {
                    // the default is the empty list
                    this.obj[p].fromArray(prop);
                }
            }
            var scalar_properties = this.scalar_properties;
            for (var p_index=0,len=scalar_properties.length; p_index<len; p_index++) {
                var p = scalar_properties[p_index]
                this.obj[p] = this.model.get(p);
            }
            var enum_properties = this.enum_properties;
            for (var p_index=0,len=enum_properties.length; p_index<len; p_index++) {
                var p = enum_properties[p_index]
                this.obj[p] = THREE[this.model.get(p)];
            }
            var set_properties = this.set_properties;
            for (var p_index=0,len=set_properties.length; p_index<len; p_index++) {
                var p = set_properties[p_index]
                this.obj[p].set(this.model.get(p));
            }

        }
    });


    var Object3dView = ThreeView.extend({
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
            this.array_properties.push('position', 'rotation', 'up', 'scale', 'matrix');
            this.scalar_properties.push('visible', 'castShadow', 'receiveShadow');
        },
        render: function() {
            ThreeView.prototype.render.call(this);
            this.update_children([], this.model.get('children'));
        },
        update_children: function(oldchildren, newchildren) {
            var that = this;
            this.do_diff(oldchildren, newchildren, function(deleted) {
                            var view = that.child_views[deleted.id];
                            that.obj.remove(view.obj);
                            view.off('replace_obj', null, that);
                            that.delete_child_view(deleted);
                         },
                         function(added) {
                            var view = that.create_child_view(added);
                            that.obj.add(view.obj);
                            view.on('replace_obj', that.replace_child_obj, that);
                         });
        },

        new_obj: function() {
            return new THREE.Object3D();
        },
        update: function() {
            if (this.model.hasChanged('children')) {
                this.update_children(this.model.previous('children'), this.model.get('children'));
            }
            ThreeView.prototype.update.call(this);
        },

        needs_update: function() {
            this.obj.needsUpdate = true;
        },

        replace_child_obj: function(old_obj, new_obj) {
            this.obj.remove(old_obj);
            this.obj.add(new_obj);
            // TODO: trigger re-render, when we have an event-driven rendering loop
        },
    });
    IPython.WidgetManager.register_widget_view('Object3dView', Object3dView);

    var CameraView = Object3dView.extend({
        new_properties: function() {
            Object3dView.prototype.new_properties.call(this);
            this.scalar_properties.push('fov', 'ratio');
        },
        new_obj: function() {
            return new THREE.PerspectiveCamera( this.model.get('fov'), this.model.get('ratio'), 1, 1000 );
        },
        needs_update: function() {
            this.obj.updateProjectionMatrix()
        }
    });
    IPython.WidgetManager.register_widget_view('CameraView', CameraView);

    var OrbitControlsView = ThreeView.extend({
        render: function() {
            // .view or .views--- this is to make things backwards compatible until my PR gets merged to IPython
            this.controlled_view = this.model.get('controlling').view || this.model.get('controlling').views[0];
            this.obj = new THREE.OrbitControls(this.controlled_view.obj, this.options.dom);
            this.options.update(this.obj.update, this.obj);
            delete this.options.renderer;
        }
    });
    IPython.WidgetManager.register_widget_view('OrbitControlsView', OrbitControlsView);


    var SceneView = Object3dView.extend({
        new_obj: function() {return new THREE.Scene();}
    });
    IPython.WidgetManager.register_widget_view('SceneView', SceneView);

    var SurfaceGeometryView = ThreeView.extend({
        update: function() {
            var obj = new THREE.PlaneGeometry(this.model.get('width'),
                                              this.model.get('height'),
                                              this.model.get('width_segments'),
                                              this.model.get('height_segments'));
            // PlaneGeometry constructs its vertices by going across x coordinates, starting from the maximum y coordinate
            var z = this.model.get('z');
            for (var i = 0, len = obj.vertices.length; i<len; i++) {
                obj.vertices[i].z = z[i];
            }
            obj.computeCentroids()
            obj.computeFaceNormals();
            obj.computeVertexNormals();
            this.replace_obj(obj);
        },
    });
    IPython.WidgetManager.register_widget_view('SurfaceGeometryView', SurfaceGeometryView);

    var FaceGeometryView = ThreeView.extend({

        update: function() {
            // Construct triangles
            var geometry = new THREE.Geometry();
            var vertices = this.model.get('vertices');
            var face3 = this.model.get('face3');
            var face4 = this.model.get('face4');
            var i, len;
            var v0, v1, v2;
            var f0,f1,f2,f3;
            for(i = 0, len=vertices.length; i<len; i+=3) {
                v0=vertices[i]; v1=vertices[i+1]; v2=vertices[i+2];
                geometry.vertices.push(new THREE.Vector3(v0, v1, v2));
            }
            for(i=0, len=face3.length; i<len; i+=3) {
                f0 = face3[i]; f1 = face3[i+1]; f2=face3[i+2];
                geometry.faces.push(new THREE.Face3(f0, f1, f2));
            }
            for(i=0, len=face4.length; i<len; i+=4) {
                f0=face4[i]; f1=face4[i+1]; f2=face4[i+2]; f3=face4[i+3];
                geometry.faces.push(new THREE.Face3(f0, f1, f2));
                geometry.faces.push(new THREE.Face3(f0, f2, f3));
            }

            geometry.mergeVertices();
            geometry.computeCentroids();
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            geometry.computeBoundingSphere();
            this.replace_obj(geometry);
        }
    });
    IPython.WidgetManager.register_widget_view('FaceGeometryView', FaceGeometryView);


    var SphereGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.SphereGeometry(this.model.get('radius'), 32,16));
        }
    })
    IPython.WidgetManager.register_widget_view('SphereGeometryView', SphereGeometryView);

    var CylinderGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.CylinderGeometry(this.model.get('radiusTop'),
                                                        this.model.get('radiusBottom'),
                                                        this.model.get('height'),
                                                        this.model.get('radiusSegments'),
                                                        this.model.get('heightSegments'),
                                                        this.model.get('openEnded')));
        }
    })
    IPython.WidgetManager.register_widget_view('CylinderGeometryView', CylinderGeometryView);

    var CubeGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.CubeGeometry(this.model.get('width'),
                                                        this.model.get('height'),
                                                        this.model.get('depth'),
                                                        this.model.get('widthSegments'),
                                                        this.model.get('heightSegments'),
                                                        this.model.get('depthSegments')));
        }
    })
    IPython.WidgetManager.register_widget_view('CubeGeometryView', CubeGeometryView);

    var CircleGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.CircleGeometry(this.model.get('radius'),
                                                        this.model.get('segments'),
                                                        this.model.get('thetaStart'),
                                                        this.model.get('thetaLength')));
        }
    })
    IPython.WidgetManager.register_widget_view('CircleGeometryView', CircleGeometryView);

    var LatheGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.LatheGeometry(this.model.get('segments'),
                                                        this.model.get('points'),
                                                        this.model.get('phiLength'),
                                                        this.model.get('phiStart')));
        }
    })
    IPython.WidgetManager.register_widget_view('CircleGeometryView', CircleGeometryView);

    var IcosahedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.IcosahedronGeometry(this.model.get('radius'),
                                                        this.model.get('detail')));
        }
    })
    IPython.WidgetManager.register_widget_view('IcosahedronGeometryView', IcosahedronGeometryView);

    var OctahedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.OctahedronGeometry(this.model.get('radius'),
                                                        this.model.get('detail')));
        }
    })
    IPython.WidgetManager.register_widget_view('OctahedronGeometryView', OctahedronGeometryView);

    var PlaneGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.PlaneGeometry(this.model.get('width'),
                                                        this.model.get('height'),
                                                        this.model.get('widthSegments'),
                                                        this.model.get('heightSegments')));
        }
    })
    IPython.WidgetManager.register_widget_view('PlaneGeometryView', PlaneGeometryView);

    var TetrahedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.TetrahedronGeometry(this.model.get('radius'),
                                                        this.model.get('detail')));
        }
    })
    IPython.WidgetManager.register_widget_view('TetrahedronGeometryView', TetrahedronGeometryView);

    var TorusGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.TorusGeometry(this.model.get('radius'),
                                                        this.model.get('tube'),
                                                        this.model.get('radialSegments'),
                                                        this.model.get('tubularSegments'),
                                                        this.model.get('arc')));
        }
    })
    IPython.WidgetManager.register_widget_view('TorusGeometryView', TorusGeometryView);

    var TorusKnotGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.TorusKnotGeometry(this.model.get('radius'),
                                                        this.model.get('tube'),
                                                        this.model.get('radialSegments'),
                                                        this.model.get('tubularSegments'),
                                                        this.model.get('p'),
                                                        this.model.get('q'),
                                                        this.model.get('heightScale')));
        }
    })
    IPython.WidgetManager.register_widget_view('TorusKnotGeometryView', TorusKnotGeometryView);

    var PolyhedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.PolyhedronGeometry(this.model.get('vertices'),
                                                          this.model.get('faces'),
                                                          this.model.get('radius'),
                                                          this.model.get('detail')));
        }
    })
    IPython.WidgetManager.register_widget_view('PolyhedronGeometryView', PolyhedronGeometryView);

    var MaterialView = ThreeView.extend({
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
            this.enum_properties.push('side', 'blending', 'blendSrc', 'blendDst', 'blendEquation');
            this.scalar_properties.push('opacity', 'depthTest', 'depthWrite', 'polygonOffset', 'polygonOffsetFactor',
                                        'polygonOffsetUnits', 'overdraw', 'visible');
        },
        new_obj: function() {return new THREE.Material();},
        needs_update: function() {
            this.obj.needsUpdate = true;
        }
    })
    IPython.WidgetManager.register_widget_view('MaterialView', MaterialView);

    var BasicMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('shading', 'vertexColors');
            this.set_properties.push('color');
            this.scalar_properties.push('wireframe', 'wireframeLinewidth', 'wireframeLinecap', 'wireframeLinejoin',
                                        'fog', 'skinning', 'morphTargets');
        },
        new_obj: function() {return new THREE.MeshBasicMaterial();},
        needs_update: function() {
            MaterialView.prototype.needs_update.call(this);
        }
    })
    IPython.WidgetManager.register_widget_view('BasicMaterialView', BasicMaterialView);

    var LambertMaterialView = BasicMaterialView.extend({
        new_obj: function() {return new THREE.MeshLambertMaterial();}
    })
    IPython.WidgetManager.register_widget_view('LambertMaterialView', LambertMaterialView);

    var PhongMaterialView = BasicMaterialView.extend({
        new_obj: function() {return new THREE.MeshPhongMaterial();}
    })
    IPython.WidgetManager.register_widget_view('PhongMaterialView', PhongMaterialView);

    var DepthMaterialView = MaterialView.extend({
        new_obj: function() {return new THREE.MeshDepthMaterial();}
    })
    IPython.WidgetManager.register_widget_view('DepthMaterialView', DepthMaterialView);

    var LineBasicMaterialView = MaterialView.extend({
        new_obj: function() {return new THREE.LineBasicMaterial();}
    })
    IPython.WidgetManager.register_widget_view('LineBasicMaterialView', LineBasicMaterialView);

    var MeshView = Object3dView.extend({
        // if we replace the geometry or material, do a full re-render
        // TODO: make sure we don't set multiple such handlers, so this should probably happen in the init, not the render
        //this.model.on('change:geometry', this.render, this);
        //this.model.on('change:material', this.render, this);
        render: function() {
            this.geometryview = this.create_child_view(this.model.get('geometry'));
            this.materialview = this.create_child_view(this.model.get('material'));
            this.geometryview.on('replace_obj', this.update, this);
            this.materialview.on('replace_obj', this.update, this);
            this.update()
            return this.obj;
        },
        update: function() {
            this.replace_obj(new THREE.Mesh( this.geometryview.obj, this.materialview.obj ));
            //this.obj.geometry = this.geometryview.obj;
            //this.obj.material = this.materialview.obj;
            //this.obj.material.needsUpdate=true;
            Object3dView.prototype.update.call(this);
        }
    });
        IPython.WidgetManager.register_widget_view('MeshView', MeshView);


    var Basic3dObject = Object3dView.extend({
        render: function() {
            this.update()
            return this.obj;
        },
        update: function() {
            this.replace_obj(this.new_obj());
            Object3dView.prototype.update.call(this);
        }
    });
    var AmbientLight = Basic3dObject.extend({
        new_obj: function() {return new THREE.AmbientLight(this.model.get('color'));}
    });
    IPython.WidgetManager.register_widget_view('AmbientLight', AmbientLight);

    var DirectionalLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.DirectionalLight(this.model.get('color'),
                                              this.model.get('intensity'));
        }
    });
    IPython.WidgetManager.register_widget_view('DirectionalLight', DirectionalLight);

    var PointLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.PointLight(this.model.get('color'),
                                        this.model.get('intensity'),
                                        this.model.get('distance'));
        }
    });
    IPython.WidgetManager.register_widget_view('PointLight', PointLight);

    var SpotLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.SpotLight(this.model.get('color'),
                                       this.model.get('intensity'),
                                       this.model.get('distance'));
        }
    });
    IPython.WidgetManager.register_widget_view('SpotLight', SpotLight);

    var HemisphereLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.HemisphereLight(this.model.get('color'),
                                             this.model.get('ground_color'),
                                             this.model.get('intensity'));
        }
    });
    IPython.WidgetManager.register_widget_view('HemisphereLight', HemisphereLight);

});
