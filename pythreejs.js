// we do this so it works in IPython or the sage cell server
var require = require || sagecell.require;
var requirejs = requirejs || sagecell.requirejs
var define = define || sagecell.define;

requirejs.config({
  paths: {
        'threejs': 'http://boxen.math.washington.edu/home/jason/three.js/build/three.min',
        'threejs-trackball': 'http://boxen.math.washington.edu/home/jason/three.js/examples/js/controls/TrackballControls',
        'threejs-orbit': 'http://boxen.math.washington.edu/home/jason/three.js/examples/js/controls/OrbitControls',
        'threejs-detector': 'http://boxen.math.washington.edu/home/jason/three.js/examples/js/Detector',
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
        console.log('RendererView registered');
    var ThreeView = IPython.WidgetView.extend({

        
        replace_obj: function(new_obj) {
            var old_obj = this.obj;
            this.obj = new_obj;
            this.trigger('replace_obj', old_obj, new_obj);
        }
    });

    
    var Object3dView = ThreeView.extend({
        // this is meant to be called *after* the object has been created, and modifies the object
        // to reflect rotation, matrix, etc.
        update_object_parameters: function() {
            var array_props = ['position', 'rotation', 'up', 'scale']
            for (var prop=0,len=array_props.length; prop<len; prop++) {
                var p = array_props[prop];
                if (p !== null) {
                    this.obj[p].fromArray(this.model.get(p));
                }
            }
            var bool_props = ['visible', 'castShadow', 'receiveShadow']
            for (var prop=0,len=bool_props.length; prop<len; prop++) {
                var p = bool_props[prop]
                this.obj[p] = this.model.get(p);
            }
            if (this.model.get('matrix').length===16) {
                this.obj.matrix.fromArray(this.model.get('matrix'));
            }
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

        render: function() {
            this.obj = this.new_obj();
            this.update_children([], this.model.get('children'));
            this.update();
        },
        new_obj: function() {
            return new THREE.Object3D();
        },
        update: function() {
            //this.replace_obj(this.new_obj());
            this.update_object_parameters();
            if (this.model.hasChanged('children')) {
                this.update_children(this.model.previous('children'), this.model.get('children'));
            }
        },
        replace_child_obj: function(old_obj, new_obj) {
            this.obj.remove(old_obj);
            this.obj.add(new_obj);
            // TODO: trigger re-render, when we have an event-driven rendering loop
        },
    });
    IPython.WidgetManager.register_widget_view('Object3dView', SceneView);
    
    var CameraView = Object3dView.extend({
        new_obj: function() {
            return new THREE.PerspectiveCamera( this.model.get('fov'), this.model.get('ratio'), 1, 1000 );
        }
    });
    IPython.WidgetManager.register_widget_view('CameraView', CameraView);

    var OrbitControlsView = ThreeView.extend({
        render: function() {
            this.controlled_view = this.model.widget_manager.get_model(this.model.get('controlling')).views[0];
            this.obj = new THREE.OrbitControls(this.controlled_view.obj, this.options.dom);
            this.options.update(this.obj.update, this.obj);
            delete this.options.renderer; 
        }
    });
    IPython.WidgetManager.register_widget_view('OrbitControlsView', OrbitControlsView);


    var SceneView = Object3dView.extend({
        render: function() {
            var scene = this.obj = new THREE.Scene();
            this.update_children([], this.model.get('children'))
            this.update();
            return scene;
        }    
    });
    IPython.WidgetManager.register_widget_view('SceneView', SceneView);

    var SurfaceGeometryView = ThreeView.extend({
        render: function() {
            this.update()
            return this.obj;
        },
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
        }
    });
    IPython.WidgetManager.register_widget_view('SurfaceGeometryView', SurfaceGeometryView);
    
    var SphereGeometryView = ThreeView.extend({
        render: function() {
            this.update()
            return this.obj;
        },
        update: function() {
            this.replace_obj(new THREE.SphereGeometry(this.model.get('radius'), 32,16));
        }
    })
    IPython.WidgetManager.register_widget_view('SphereGeometryView', SphereGeometryView);

    
    var MaterialView = ThreeView.extend({
        render: function() {
            this.obj = new THREE.MeshLambertMaterial({color: this.model.get('color'), 
                                                      side: THREE.DoubleSide});
            return this.obj;
        },
        update: function() {
            this.obj.color.set(this.model.get('color'));
            this.obj.opacity = this.model.get('opacity');
            this.obj.transparent = (this.obj.opacity<1.0);
            this.obj.wireframe = this.model.get('wireframe');
            this.obj.needsUpdate=true;
        }
    })
        IPython.WidgetManager.register_widget_view('MaterialView', MaterialView);

    var MeshView = Object3dView.extend({
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
        new_obj: function() {
            return new THREE.AmbientLight(this.model.get('color'));
        }
    });   
    IPython.WidgetManager.register_widget_view('AmbientLight', AmbientLight);
    
    var DirectionalLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.DirectionalLight(this.model.get('color'), this.model.get('intensity'));
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

});

console.log('pythreejs registered');

