// included version of three.js is from commit da1a7a1e92a4410cf0901fee3ea69a36cd2b0025 from my fork at https://github.com/jasongrout/three.js/
require.config({
    map: {
        "*": {
            "threejs": "nbextensions/pythreejs/three.js/build/three",
            "threejs-projector": "nbextensions/pythreejs/three.js/examples/js/renderers/Projector",
            "threejs-canvas": "nbextensions/pythreejs/three.js/examples/js/renderers/CanvasRenderer",
            "threejs-orbit": "nbextensions/pythreejs/three.js/examples/js/controls/OrbitControls",
            "threejs-fly": "nbextensions/pythreejs/three.js/examples/js/controls/MomentumCameraControls",
            "threejs-trackball": "nbextensions/pythreejs/three.js/examples/js/controls/TrackballControls",
            "threejs-detector": "nbextensions/pythreejs/three.js/examples/js/Detector"
        }
    },
    shim: {
        "nbextensions/pythreejs/three.js/examples/js/renderers/Projector": {deps: ["nbextensions/pythreejs/three.js/build/three"]},
        "nbextensions/pythreejs/three.js/examples/js/renderers/CanvasRenderer": {deps: ["nbextensions/pythreejs/three.js/build/three", "nbextensions/pythreejs/three.js/examples/js/renderers/Projector"]},
        "nbextensions/pythreejs/three.js/examples/js/controls/OrbitControls": {deps: ["nbextensions/pythreejs/three.js/build/three"]},
        "nbextensions/pythreejs/three.js/examples/js/controls/MomentumCameraControls": {deps: ["nbextensions/pythreejs/three.js/build/three"]},
        "nbextensions/pythreejs/three.js/examples/js/controls/TrackballControls": {deps: ["nbextensions/pythreejs/three.js/build/three"]},
        "nbextensions/pythreejs/three.js/examples/js/Detector": {deps: ["nbextensions/pythreejs/three.js/build/three"]},
        "nbextensions/pythreejs/three.js/build/three": {exports: "THREE"}
    },
});

define(["nbextensions/widgets/widgets/js/widget", "nbextensions/widgets/widgets/js/manager", "base/js/utils", "underscore",
        "threejs", "threejs-canvas", "threejs-orbit", "threejs-fly", "threejs-trackball", "threejs-detector", "threejs-projector"],
       function(widget, manager, utils, _, THREE) {
    console.log("loading pythreejs");
    var register = {};
    var RendererView = widget.WidgetView.extend({
        render : function(){
            console.log('created renderer');
            this.on('displayed', this.show, this);
            var that = this;
            this.id = utils.uuid();
            var render_loop = {register_update: function(fn, context) {that.on('animate:update', fn, context);},
                               render_frame: function () {
                                   that._render = true; that.schedule_update()
                               },
                               renderer_id: this.id}
            if ( Detector.webgl )
                this.renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true} );
            else
                this.renderer = new THREE.CanvasRenderer();
            this.$el.empty().append( this.renderer.domElement );
            var that = this;
            var view_promises = [];
            view_promises.push(this.create_child_view(this.model.get('camera'), render_loop).then(
                function(view) {
                    that.camera = view;
                }));
            view_promises.push(this.create_child_view(this.model.get('scene'), render_loop).then(
                function(view) {
                    that.scene = view;
                }));
            var effect_promise;
            if (this.model.get('effect')) {
                effect_promise = this.create_child_view(this.model.get('effect'), {renderer: this.renderer}).then(function(view) {
                    that.effectrenderer = view.obj;
                })
            } else {
                effect_promise = Promise.resolve(this.renderer).then(function(r) {
                    that.effectrenderer = r;
                });
            }
            view_promises.push(effect_promise.then(function() {
                that.effectrenderer.setSize(that.model.get('width'),
                                            that.model.get('height'));
                if (that.model.get('background')) {
                    that.effectrenderer.setClearColor(that.model.get('background'))
                }
            }));
            this.view_promises = Promise.all(view_promises).then(function(objs) {
                that.scene.obj.add(that.camera.obj);
                console.log('renderer', that.model, that.scene.obj, that.camera.obj);
                that.update();
                that._animation_frame = false;
                var controls = _.map(that.model.get('controls'), 
                                     function(m) {
                                         return that.create_child_view(m,_.extend({},
                                                                                  {dom: that.renderer.domElement,
                                                                                   start_update_loop: function() {
                                                                                       that._update_loop = true; 
                                                                                       that.schedule_update();
                                                                                   },
                                                                                   end_update_loop: function() {
                                                                                       that._update_loop = false;
                                                                                   },
                                                                                   renderer: that},
                                                                                  render_loop))}, that);
                return Promise.all(controls)
                    .then(function(c) {
                        that.controls = c;
                    })
                    .then(function() {
                        that._render = true;
                        that.schedule_update();
                        window.r = that;
                    });
            });
            return this.view_promises;
        },
        schedule_update: function() {
            if (!this._animation_frame) {
                this._animation_frame = requestAnimationFrame(_.bind(this.animate, this))
            }
        },
        animate: function() {
            this._animation_frame = false;
            if (this._update_loop) {
                this.schedule_update();
            }
            this.trigger('animate:update', this);
            if (this._render) {
                this.effectrenderer.render(this.scene.obj, this.camera.obj)
                this._render = false;
            }
        },
        update : function(){
            var that = this;
            this.view_promises.then(function() {
                that.effectrenderer.setSize(that.model.get('width'),
                                            that.model.get('height'));
                if (that.model.get('background')) {
                    that.effectrenderer.setClearColor(that.model.get('background'))
                }
            });

            widget.DOMWidgetView.prototype.update.call(that);

        },
    });
    register['RendererView'] = RendererView;

    var ThreeView = widget.WidgetView.extend({
        initialize: function () {
            widget.WidgetView.prototype.initialize.apply(this, arguments);
            this.new_properties();
        },

        render: function() {
            this.obj = this.new_obj();
            this.register_object_parameters();
            // if the update function returns a promise or other non-zero value, return that
            // otherwise, return the object we created
            var update = this.update();

            // pickers need access to the model from the three.js object
            // this.obj may not exist until after the update() call above
            this.obj.pythreejs_view = this;

            return update ? update : this.obj;
        },
        new_properties: function() {
            // initialize properties arrays
            this.array_properties = [];
            this.scalar_properties = [];
            this.enum_properties = [];
            this.set_properties = []; // properties we set using the set method
            this.child_properties = [];
            // TODO: handle submodel properties?
        },
        update: function() {
            //this.replace_obj(this.new_obj());
            //this.update_object_parameters();
            this.needs_update();
        },

        replace_obj: function(new_obj) {
            var old_obj = this.obj;
            this.obj = new_obj;
            this.obj.pythreejs_view = this;
            this.update_object_parameters();
            this.trigger('replace_obj', old_obj, new_obj);
        },
        new_obj: function() {
        },

        needs_update: function() {
            this.obj.needsUpdate = true;
            this.trigger('rerender');
        },
        register_object_parameters: function() {
            // create an array of update handlers for each declared property
            // the update handlers depend on the type of property

            var array_properties = this.array_properties;
            var updates = this.updates = {};
            // first, we create update functions for each attribute
            _.each(this.array_properties, function(p) {
                updates[p] = function(t, value) {
                    if (value.length !== 0) {
                        // the default is the empty list, 
                        // and we don't act in that case
                        t.obj[p].fromArray(value);
                    }
                }});

            _.each(this.scalar_properties, function(p) {
                updates[p] = function(t, value) {
                    t.obj[p] = value;
                }});

            _.each(this.enum_properties, function(p) {
                updates[p] = function(t, value) {
                    t.obj[p] = THREE[value];
                }});

            _.each(this.set_properties, function(p) {
                updates[p] = function(t, value) {
                    t.obj[p].set(value);
                }});

            _.each(this.child_properties, function(p) {
                updates[p] = function(t, value) {
                    if (value) {
                        if (t[p]) {
                            t.stopListening(t[p]);
                        }
                        t.create_child_view(value, t.options[p]).then(function(view) {
                            t[p] = view;
                            var update = function() {
                                t.obj[p] = t[p].obj; 
                                t.needs_update()
                            };
                            update();
                            t.listenTo(t[p], 'replace_obj', update)
                        });
                    }
                }});

            // next, we call and then register the update functions to changes
            _.each(updates, function(update, p) {
                update(this, this.model.get(p));
                this.model.on('change:'+p, function(model, value, options) {update(this, value)}, this);
            }, this);
        },
        update_object_parameters: function() {
            _.each(this.updates, function(update, p) {
                update(this, this.model.get(p));
            }, this);
        }
    });

    var AnaglyphEffectView = ThreeView.extend({
        new_obj: function() {
        return new THREE.AnaglyphEffect( this.options.renderer );
        }
    })
    register['AnaglyphEffectView'] = AnaglyphEffectView;

    var Object3dView = ThreeView.extend({
        initialize: function() {
            ThreeView.prototype.initialize.apply(this, arguments);
            var that = this;
            this.children = new widget.ViewList(
                function add(model) {
                    return that.create_child_view(model, 
                                                  _.pick(that.options, 'register_update', 'renderer_id'))
                        .then(function(view) {
                            that.obj.add(view.obj);
                            that.listenTo(view, 'replace_obj', that.replace_child_obj);
                            that.listenTo(view, 'rerender', that.needs_update);
                            that.needs_update(); // initial rendering
                            return view;
                        });
                },
                function remove(view) {
                    that.obj.remove(view.obj);
                    that.stopListening(view);
                    view.remove();
                });
            this.children.update(this.model.get('children'));
            this.listenTo(this.model, 'change:children', function(model, value) {
                this.children.update(value);
            });
        },
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
            this.array_properties.push('position', 'quaternion', 'up', 'scale');
            this.scalar_properties.push('visible', 'castShadow', 'receiveShadow');
        },
        new_obj: function() {
            return new THREE.Object3D();
        },
        replace_child_obj: function(old_obj, new_obj) {
            this.obj.remove(old_obj);
            this.obj.add(new_obj);
            this.needs_update()
        },
        replace_obj: function(new_obj) {
            // add three.js children objects to new three.js object
            Promise.all(this.children.views).then(function(views) {
                for (var i=0; i<views.length; i++) {
                    new_obj.add(views[i].obj)
                }
            });
            ThreeView.prototype.replace_obj.apply(this, arguments);
        },
    });
    register['Object3dView'] = Object3dView;

    var ScaledObjectView = Object3dView.extend({
        render: function() {
            this.options.register_update(this.update_scale, this);
            Object3dView.prototype.render.call(this);
        },
        update_scale: function(renderer) {
            var s = renderer.camera.obj.position.length()/10;
            // one unit is about 1/10 the size of the window
            this.obj.scale.set(s,s,s);
        }
    });
    register['ScaledObjectView'] = ScaledObjectView;

    var CameraView = Object3dView.extend({
        new_obj: function() {
            return new THREE.Camera();
        },
        needs_update: function() {
            this.obj.updateProjectionMatrix();
            this.options.render_frame();
        }
    });
    register['CameraView'] = CameraView;

    var PerspectiveCameraView = CameraView.extend({
        new_properties: function() {
            CameraView.prototype.new_properties.call(this);
            this.scalar_properties.push('fov', 'aspect', 'near', 'far');
        },
        new_obj: function() {
            return new THREE.PerspectiveCamera(this.model.get('fov'),
                                                this.model.get('aspect'),
                                                this.model.get('near'),
                                                this.model.get('far'));
        }
    });
    register['PerspectiveCameraView'] = PerspectiveCameraView;

    var OrthographicCameraView = CameraView.extend({
        new_properties: function() {
            CameraView.prototype.new_properties.call(this);
            this.scalar_properties.push('left', 'right', 'top', 'bottom', 'near', 'far');
        },
        new_obj: function() {
            return new THREE.OrthographicCamera(this.model.get('left'),
                                                this.model.get('right'),
                                                this.model.get('top'),
                                                this.model.get('bottom'),
                                                this.model.get('near'),
                                                this.model.get('far'));
        }
    });
    register['OrthographicCameraView'] = OrthographicCameraView;

    var OrbitControlsView = ThreeView.extend({
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
            this.array_properties.push('target');
        },

        render: function() {
            var that = this;
            return utils.resolve_promises_dict(this.model.get('controlling').views).then(function(views) {
                // get the view that is tied to the same renderer
                that.controlled_view = _.find(views, function(o) {
                    return o.options.renderer_id === that.options.renderer_id
                }, that);
                that.obj = new THREE.OrbitControls(that.controlled_view.obj, that.options.dom);
                that.register_object_parameters();
                that.obj.noKeys = true; // turn off keyboard navigation
                that.options.register_update(that.obj.update, that.obj);
                that.obj.addEventListener('change', that.options.render_frame);
                that.obj.addEventListener('start', that.options.start_update_loop);
                that.obj.addEventListener('end', that.options.end_update_loop);
                that.obj.addEventListener('end', function() { that.update_controlled(); });
                // if there is a three.js control change, call the animate function to animate at least one more time
                delete that.options.renderer;
            });
        },
        
        update_controlled: function() {
            // Since OrbitControlsView changes the position of the object, we update the position when we've stopped moving the object
            // it's probably prohibitive to update it in real-time
            var pos = this.controlled_view.obj.position;
            var qat = this.controlled_view.obj.quaternion;
            this.controlled_view.model.set('position', [pos.x, pos.y, pos.z]);
            this.controlled_view.model.set('quaternion', [qat._x, qat._y, qat._z, qat._w]);
            this.controlled_view.touch();
        },
    });
    register['OrbitControlsView'] = OrbitControlsView;

    var FlyControlsView = ThreeView.extend({
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
        },

        render: function() {
            var that = this;
            this.clock = new THREE.Clock();

            return utils.resolve_promises_dict(this.model.get('controlling').views).then(function(views) {
                // get the view that is tied to the same renderer
                that.controlled_view = _.find(views, function(o) {
                    return o.options.renderer_id === that.options.renderer_id
                }, that);
                that.obj = new THREE.FlyControls(that.controlled_view.obj, that.options.dom);
                that.register_object_parameters();
                that.options.register_update(that._update, that);
                that.obj.addEventListener('change', that.options.render_frame);
                that.obj.addEventListener('change', function() { that.update_controlled(); });
                that.options.start_update_loop();
                that.model.on_some_change(['forward_speed', 'upward_speed', 'lateral_speed',
                                           'roll', 'yaw', 'pitch'], that.update_plane, that);
                delete that.options.renderer;
            });
        },

        update_plane: function() {
            this.obj.moveState.back = this.model.get('forward_speed');
            this.obj.moveState.up = this.model.get('upward_speed');
            this.obj.moveState.left = this.model.get('lateral_speed');
            this.obj.moveState.pitchUp = this.model.get('pitch');
            this.obj.moveState.yawRight = this.model.get('yaw');
            this.obj.moveState.rollLeft = this.model.get('roll');
            this.obj.updateRotationVector();
            this.obj.updateMovementVector();
        },

        _update: function() {
            this.obj.movementSpeed = 0.33;
            this.obj.update(this.clock.getDelta());
        },
 
        update_controlled: function() {
            var pos = this.controlled_view.obj.position;
            var qat = this.controlled_view.obj.quaternion;
            this.controlled_view.model.set('position', [pos.x, pos.y, pos.z]);
            this.controlled_view.model.set('quaternion', [qat._x, qat._y, qat._z, qat._w]);
            this.controlled_view.touch();
        },
    });
    register['FlyControlsView'] = FlyControlsView;

    var TrackballControlsView = ThreeView.extend({
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
            this.array_properties.push('target');
        },

        render: function() {
            var that = this;
            return utils.resolve_promises_dict(this.model.get('controlling').views).then(function(views) {
                // get the view that is tied to the same renderer
                that.controlled_view = _.find(views, function(o) {
                    return o.options.renderer_id === that.options.renderer_id
                }, that);
                that.obj = new THREE.TrackballControls(that.controlled_view.obj, that.options.dom);
                that.register_object_parameters();
                that.obj.noKeys = true; // turn off keyboard navigation
                that.options.register_update(that.obj.update, that.obj);
                that.obj.addEventListener('change', that.options.render_frame);
                that.obj.addEventListener('start', that.options.start_update_loop);
                that.obj.addEventListener('end', that.options.end_update_loop);
                that.obj.addEventListener('end', function() { that.update_controlled(); });
                // resize again because domElement.getBoundingClientRect() returned all zeros when it's first called
                var set_control_size = function () {
                    that.obj.handleResize();
                    that.options.dom.removeEventListener("mouseover", set_control_size);
                    that.options.dom.removeEventListener("touchstart", set_control_size);
                };
                that.options.dom.addEventListener("mouseover", set_control_size);
                that.options.dom.addEventListener("touchstart", set_control_size);
                // if there is a three.js control change, call the animate function to animate at least one more time
                delete that.options.renderer;
            });
        },

        update_controlled: function() {
            // Since TrackballControlsView changes the position of the object, we update the position when we've stopped moving the object
            // it's probably prohibitive to update it in real-time
            var pos = this.controlled_view.obj.position;
            var qat = this.controlled_view.obj.quaternion;
            this.controlled_view.model.set('position', [pos.x, pos.y, pos.z]);
            this.controlled_view.model.set('quaternion', [qat._x, qat._y, qat._z, qat._w]);
            this.controlled_view.touch();
        },
    });
    register['TrackballControlsView'] = TrackballControlsView;


    var PickerView = ThreeView.extend({
        render: function() {
            var that = this;
            this.model.on('change:root', this.change_root, this);
            this.change_root(this.model, this.model.get('root'));
            this.options.dom.addEventListener(this.model.get('event'), function(event) {
                var offset = $(this).offset();
                var mouseX = ((event.pageX - offset.left) / $(that.options.dom).width()) * 2 - 1;
                var mouseY = -((event.pageY - offset.top) / $(that.options.dom).height()) * 2 + 1;
                var vector = new THREE.Vector3(mouseX, mouseY, that.options.renderer.camera.obj.near);

                vector.unproject(that.options.renderer.camera.obj);
                var ray = vector.sub(that.options.renderer.camera.obj.position).normalize();
                that.obj = new THREE.Raycaster(that.options.renderer.camera.obj.position, ray);
                var objs = that.obj.intersectObject(that.root.obj, true);
                var getinfo = function(o) {
                    var v = o.object.geometry.vertices;
                    var verts = [[v[o.face.a].x, v[o.face.a].y, v[o.face.a].z],
                                 [v[o.face.b].x, v[o.face.b].y, v[o.face.b].z],
                                 [v[o.face.c].x, v[o.face.c].y, v[o.face.c].z]]
                    return {point: [o.point.x, o.point.y, o.point.z],
                            distance: o.distance,
                            face: [o.face.a, o.face.b, o.face.c],
                            faceVertices: verts,
                            faceNormal: [o.face.normal.x, o.face.normal.y, o.face.normal.z],
                            faceIndex: o.faceIndex,
                            object: o.object.pythreejs_view.model
                           }
                }
                if(objs.length > 0) {
                    // perhaps we should set all attributes to null if there are
                    // no intersections?
                    var o = getinfo(objs[0]);
                    that.model.set('point', o.point);
                    that.model.set('distance', o.distance);
                    that.model.set('face', o.face);
                    that.model.set('faceVertices', o.faceVertices);
                    that.model.set('faceNormal', o.faceNormal);
                    that.model.set('object', o.object);
                    that.model.set('faceIndex', o.faceIndex);
                    if (that.model.get('all')) {
                        that.model.set('picked', _.map(objs, getinfo));
                    }
                    that.touch();
                }
            });
        },

        change_root: function(model, root) {
            if (root) {
                // we need to get the three.js object for the root object in our scene
                // so find a view of the model that exists in our scene
                var that = this;
                utils.resolve_promises_dict(root.views).then(function(views) {
                    var r = _.find(views, function(o) {
                        return o.options.renderer_id === that.options.renderer_id;
                    });
                    that.root = r;
                }).catch(utils.reject("Could not set up Picker", true));
            } else {
                this.root = this.options.renderer.scene;
            }
        }

    });
    register['PickerView'] = PickerView;


    var SceneView = Object3dView.extend({
        new_obj: function() {return new THREE.Scene();},
        needs_update: function() {this.options.render_frame();}
    });
    register['SceneView'] = SceneView;



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
            obj.computeFaceNormals();
            obj.computeVertexNormals();
            this.replace_obj(obj);
        },
    });
    register['SurfaceGeometryView'] = SurfaceGeometryView;

    var PlainGeometryView = ThreeView.extend({
        update: function() {
            var geometry = new THREE.Geometry();
            var vertices = this.model.get('vertices');
            var faces = this.model.get('faces');
            var colors = this.model.get('colors');
            var faceVertexUvs = this.model.get('faceVertexUvs')

            var i, len;
            var f;
            for(i = 0, len=vertices.length; i<len; i+=1) {
                geometry.vertices.push((new THREE.Vector3()).fromArray(vertices[i]));
            }
            for(i=0, len=faces.length; i<len; i+=1) {
                f = faces[i];
                geometry.faces.push(new THREE.Face3(f[0], f[1], f[2]));
            }
            for(i=0, len=colors.length; i<len; i+=1) {
                geometry.colors.push(new THREE.Color(colors[i]));
            }
            // TODO: faceVertexUvs
	    geometry.verticesNeedUpdate = true;
	    geometry.elementsNeedUpdate = true;
	    geometry.uvsNeedUpdate = true;
	    geometry.normalsNeedUpdate = true;
	    geometry.tangentsNeedUpdate = true;
	    geometry.colorsNeedUpdate = true;
	    geometry.lineDistancesNeedUpdate = true;
            this.replace_obj(geometry);
        },
    });
    register['PlainGeometryView'] = PlainGeometryView;

    var FaceGeometryView = ThreeView.extend({

        update: function() {
            // Construct triangles
            var geometry = new THREE.Geometry();
            var vertices = this.model.get('vertices');
            var face3 = this.model.get('face3');
            var face4 = this.model.get('face4');
            var facen = this.model.get('facen');
            var face;
            var i, f, len, lenf;
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
            for(i=0, len=facen.length; i<len; i++) {
                face = facen[i];
                f0 = face[0];
                for(f=1, lenf=face.length-1; f<lenf; f++) {
                    geometry.faces.push(new THREE.Face3(f0, face[f], face[f+1]));
                }
            }
            geometry.mergeVertices();
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            geometry.computeBoundingSphere();
            this.replace_obj(geometry);
        }
    });
    register['FaceGeometryView'] = FaceGeometryView;


    var SphereGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.SphereGeometry(this.model.get('radius'), 32,16));
        }
    });
    register['SphereGeometryView'] = SphereGeometryView;

    var CylinderGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.CylinderGeometry(this.model.get('radiusTop'),
                                                        this.model.get('radiusBottom'),
                                                        this.model.get('height'),
                                                        this.model.get('radiusSegments'),
                                                        this.model.get('heightSegments'),
                                                        this.model.get('openEnded')));
        }
    });
    register['CylinderGeometryView'] = CylinderGeometryView;

    var BoxGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.BoxGeometry(this.model.get('width'),
                                                        this.model.get('height'),
                                                        this.model.get('depth'),
                                                        this.model.get('widthSegments'),
                                                        this.model.get('heightSegments'),
                                                        this.model.get('depthSegments')));
        }
    });
    register['BoxGeometryView'] = BoxGeometryView;

    var CircleGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.CircleGeometry(this.model.get('radius'),
                                                        this.model.get('segments'),
                                                        this.model.get('thetaStart'),
                                                        this.model.get('thetaLength')));
        }
    });
    register['CircleGeometryView'] = CircleGeometryView;

    var LatheGeometryView = ThreeView.extend({
        update: function() {
            var points = this.model.get('points');
            var pnt = [];
            for (var p_index = 0, len = points.length; p_index < len; p_index++ ) {
                var a = new THREE.Vector3().fromArray(points[p_index]);
                pnt.push(a);
            }
            this.replace_obj(new THREE.LatheGeometry(pnt,
                                                        this.model.get('segments'),
                                                        this.model.get('phiStart'),
                                                        this.model.get('phiLength')));
        }
    });
    register['LatheGeometryView'] = LatheGeometryView;

    var TubeGeometryView = ThreeView.extend({
        update: function() {
            var points = this.model.get('path');
            var pnt = [];
            for (var p_index = 0, len = points.length; p_index < len; p_index++ ) {
                var a = new THREE.Vector3().fromArray(points[p_index]);
                pnt.push(a);
            }
            var path = new THREE.SplineCurve3(pnt);
            this.replace_obj(new THREE.TubeGeometry(path,
                                                        this.model.get('segments'),
                                                        this.model.get('radius'),
                                                        this.model.get('radialSegments'),
                                                        this.model.get('closed')));
        }
    });
    register['TubeGeometryView'] = TubeGeometryView;

    var IcosahedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.IcosahedronGeometry(this.model.get('radius'),
                                                        this.model.get('detail')));
        }
    });
    register['IcosahedronGeometryView'] = IcosahedronGeometryView;

    var OctahedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.OctahedronGeometry(this.model.get('radius'),
                                                        this.model.get('detail')));
        }
    });
    register['OctahedronGeometryView'] = OctahedronGeometryView;

    var PlaneGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.PlaneGeometry(this.model.get('width'),
                                                        this.model.get('height'),
                                                        this.model.get('widthSegments'),
                                                        this.model.get('heightSegments')));
        }
    });
    register['PlaneGeometryView'] = PlaneGeometryView;

    var TetrahedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.TetrahedronGeometry(this.model.get('radius'),
                                                        this.model.get('detail')));
        }
    });
    register['TetrahedronGeometryView'] = TetrahedronGeometryView;

    var TorusGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.TorusGeometry(this.model.get('radius'),
                                                        this.model.get('tube'),
                                                        this.model.get('radialSegments'),
                                                        this.model.get('tubularSegments'),
                                                        this.model.get('arc')));
        }
    });
    register['TorusGeometryView'] = TorusGeometryView;

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
    });
    register['TorusKnotGeometryView'] = TorusKnotGeometryView;

    var PolyhedronGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.PolyhedronGeometry(this.model.get('vertices'),
                                                          this.model.get('faces'),
                                                          this.model.get('radius'),
                                                          this.model.get('detail')));
        }
    });
    register['PolyhedronGeometryView'] = PolyhedronGeometryView;

    var RingGeometryView = ThreeView.extend({
        update: function() {
            this.replace_obj(new THREE.RingGeometry(this.model.get('innerRadius'),
                                                    this.model.get('outerRadius'),
                                                    this.model.get('thetaSegments'),
                                                    this.model.get('phiSegments'),
                                                    this.model.get('thetaStart'),
                                                    this.model.get('thetaLength')));
        }
    });
    register['RingGeometryView'] = RingGeometryView;

    var ParametricGeometryView = ThreeView.extend({
        update: function() {
            eval('var s='.concat(this.model.get('func')));
            this.replace_obj(new THREE.ParametricGeometry(s,
                                                    this.model.get('slices'),
                                                    this.model.get('stacks')));
        }
    });
    register['ParametricGeometryView'] = ParametricGeometryView;
    
    var MaterialView = ThreeView.extend({
        new_properties: function() {
            ThreeView.prototype.new_properties.call(this);
            this.enum_properties.push('side', 'blending', 'blendSrc', 'blendDst', 'blendEquation');
            this.scalar_properties.push('opacity', 'transparent', 'depthTest', 'depthWrite', 'polygonOffset',
                                        'polygonOffsetFactor', 'polygonOffsetUnits', 'overdraw', 'visible');
        },
        new_obj: function() {return new THREE.Material();},
    });
    register['MaterialView'] = MaterialView;

    var BasicMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('shading', 'vertexColors');
            this.set_properties.push('color');
            this.scalar_properties.push('wireframe', 'wireframeLinewidth', 'wireframeLinecap', 'wireframeLinejoin',
                                        'fog', 'skinning', 'morphTargets');
            this.child_properties.push('map', 'lightMap', 'specularMap', 'envMap');
        },
        new_obj: function() {return new THREE.MeshBasicMaterial();}
    });
    register['BasicMaterialView'] = BasicMaterialView;

    var LambertMaterialView = BasicMaterialView.extend({
        new_properties: function() {
            BasicMaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('combine');
            this.set_properties.push('ambient', 'emissive');
            this.scalar_properties.push('reflectivity', 'refractionRatio');
        },
        new_obj: function() {return new THREE.MeshLambertMaterial();}
    });
    register['LambertMaterialView'] = LambertMaterialView;

    var PhongMaterialView = BasicMaterialView.extend({
        new_properties: function() {
            BasicMaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('combine');
            this.set_properties.push('ambient', 'emissive', 'specular');
            this.scalar_properties.push('shininess', 'reflectivity', 'refractionRatio');
        },
        new_obj: function() {return new THREE.MeshPhongMaterial();}
    });
    register['PhongMaterialView'] = PhongMaterialView;

    var DepthMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.scalar_properties.push('wireframe', 'wireframeLinewidth');
        },
        new_obj: function() {return new THREE.MeshDepthMaterial();}
    });
    register['DepthMaterialView'] = DepthMaterialView;

    var LineBasicMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('vertexColors');
            this.set_properties.push('color');
            this.scalar_properties.push('linewidth', 'fog', 'linecap', 'linejoin');
        },
        new_obj: function() {return new THREE.LineBasicMaterial();}
    });
    register['LineBasicMaterialView'] = LineBasicMaterialView;

    var LineDashedMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('vertexColors');
            this.set_properties.push('color');
            this.scalar_properties.push('linewidth', 'scale', 'dashSize', 'gapSize', 'fog');
        },
        new_obj: function() {return new THREE.LineDashedMaterial();}
    });
    register['LineDashedMaterialView'] = LineDashedMaterialView;

    var NormalMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('shading');
            this.scalar_properties.push('wireframe', 'wireframeLinewidth', 'morphTargets');
        },
        new_obj: function() {return new THREE.MeshNormalMaterial();}
    });
    register['NormalMaterialView'] = NormalMaterialView;

    var ParticleSystemMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.set_properties.push('color');
            this.scalar_properties.push('size', 'sizeAttenuation', 'vertexColors', 'fog');
            this.child_properties.push('map');
        },
        new_obj: function() {return new THREE.ParticleSystemMaterial();}
    });
    register['ParticleSystemMaterialView'] = ParticleSystemMaterialView;

    var ShaderMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.enum_properties.push('vertexColors', 'shading');
            this.scalar_properties.push('morphTargets', 'lights', 'morphNormals', 'wireframe', 'skinning', 'fog',
                                        'linewidth', 'wireframeLinewidth','fragmentShader', 'vertexShader');
        },
        new_obj: function() {return new THREE.ShaderMaterial();}
    });
    register['ShaderMaterialView'] = ShaderMaterialView;

    var MeshView = Object3dView.extend({
        // if we replace the geometry or material, do a full re-render
        // TODO: make sure we don't set multiple such handlers, so this should probably happen in the init, not the render
        //this.model.on('change:geometry', this.render, this);
        //this.model.on('change:material', this.render, this);
        render: function() {
            // geometry and material are not child_properties because either child's
            // replace_obj event should trigger a remake of the MeshView obj
            return Object3dView.prototype.render.call(this);
        },
        update: function() {
            var that = this;

            // we return the promise returned from update so that the view is considered "created"
            // when we actually have a mesh created.
            this.promise = Promise.all([this.create_child_view(this.model.get('geometry')),
                                        this.create_child_view(this.model.get('material'))]).then(
                                            function(v) {
                                                if(that.geometry) {
                                                    that.stopListening(that.geometry); 
                                                    that.geometry.remove();
                                                }
                                                if(that.material) {
                                                    that.stopListening(that.material);
                                                    that.material.remove();
                                                }
                                                that.geometry = v[0];
                                                that.material = v[1];
                                                that.listenTo(that.geometry, 'replace_obj', that.update);
                                                that.listenTo(that.material, 'replace_obj', that.update);
                                                that.listenTo(that.geometry, 'rerender', that.needs_update);
                                                that.listenTo(that.material, 'rerender', that.needs_update);
                                                that.replace_obj(new THREE.Mesh( that.geometry.obj, that.material.obj ));
                                                Object3dView.prototype.update.call(that);
                                            });
            return this.promise;
        }
    });
    register['MeshView'] = MeshView;

    var LineView = MeshView.extend({
        update: function() {
            // we call this first so this.geometry and this.material are created
            var that = this;
            var promise = MeshView.prototype.update.call(this);
            return promise.then(function() {
                that.replace_obj(new THREE.Line(that.geometry.obj, that.material.obj, 
                                                THREE[that.model.get("type")]));
                Object3dView.prototype.update.call(that);
            });
        }
    });
    register['LineView'] = LineView;

    var ImageTextureView = ThreeView.extend({
        update: function() {
            var img = new Image();
            //img.crossOrigin='anonymous';
            img.src = this.model.get('imageuri');
            img.onload = $.proxy(this.needs_update, this);
            this.replace_obj(new THREE.Texture(img));
            ThreeView.prototype.update.call(this);
        },
    });
    register['ImageTextureView'] = ImageTextureView;

    var DataTextureView = ThreeView.extend({
        update: function() {
            var dataType = this.model.get('type');
            var dataArr;
            var data = this.model.get('data');
            switch (dataType)
            {
                case 'UnsignedByteType':
                    dataArr = new Uint8Array(data.length);
                    break;
                case 'ByteType':
                    dataArr = new Int8Array(data.length);
                    break;
                case 'ShortType':
                    dataArr = new Int16Array(data.length);
                    break;
                case 'IntType':
                    dataArr = new Int32Array(data.length);
                    break;
                case 'UnsignedIntType':
                    dataArr = new Uint32Array(data.length);
                    break;
                case 'FloatType':
                    dataArr = new Float32Array(data.length);
                    break;
                case 'UnsignedShortType':
                case 'UnsignedShort4444Type':
                case 'UnsignedShort5551Type':
                case 'UnsignedShort565Type':
                    dataArr = new Uint16Array(data.length);
                    break;
            }
            dataArr.set(data);

            this.replace_obj(new THREE.DataTexture(dataArr, this.model.get('width'), this.model.get('height'),
                            THREE[this.model.get('format')], THREE[dataType], THREE[this.model.get('mapping')],
                            THREE[this.model.get('wrapS')], THREE[this.model.get('wrapT')],
                            THREE[this.model.get('magFilter')], THREE[this.model.get('minFilter')],
                            this.model.get('anisotropy')));
            ThreeView.prototype.update.call(this);
        },
    });
    register['DataTextureView'] = DataTextureView;

    var SpriteMaterialView = MaterialView.extend({
        new_properties: function() {
            MaterialView.prototype.new_properties.call(this);
            this.scalar_properties.push('sizeAttenuation', 'fog', 'useScreenCoordinates', 'scaleByViewport');
            this.array_properties.push('uvScale', 'uvOffset', 'alignment');
            this.set_properties.push('color');
            this.child_properties.push('map');
        },
        new_obj: function() {return new THREE.SpriteMaterial();}
    });
    register['SpriteMaterialView'] = SpriteMaterialView;

    var SpriteView = Object3dView.extend({
        render: function() {
            var that = this;
            this.promise = this.create_child_view(this.model.get('material')).then(function(view) {
                that.material = view;
                that.material.on('replace_obj', that.update, that);
                that.material.on('rerender', that.needs_update, that);
            });
            Object3dView.prototype.render.call(this);
        },
        update: function() {
            var that = this;
            this.promise.then(function() {
                that.replace_obj(new THREE.Sprite(that.material.obj))
                Object3dView.prototype.update.call(that);
            });
        },
        needs_update: function() {
            if (this.model.get('scaleToTexture')) {
                if (this.material.map && this.material.map.aspect) {
                    var scale = this.model.get('scale');
                    var y = (scale && scale[1]) || 1.0;
                    this.model.set('scale', [y*this.material.map.aspect,y,1]);
                    this.touch();
                }
            }
            Object3dView.prototype.needs_update.call(this);
        }
    });
    register['SpriteView'] = SpriteView;

    var TextTextureView = ThreeView.extend({
        update: function() {
            var fontFace = this.model.get('fontFace');
            var size = this.model.get('size');
            var color = this.model.get('color');
            var string = this.model.get('string');

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");

            canvas.height = size;
            var font = "Normal " + size + "px " + fontFace;
            context.font = font;

            var metrics = context.measureText(string);
            var textWidth = metrics.width;
            canvas.width = textWidth;

            if (this.model.get('squareTexture')) {
                canvas.height = canvas.width;
            }
            
            this.aspect = canvas.width / canvas.height;

            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = color;
            // Must set the font again for the fillText call
            context.font = font;
            context.fillText(string, canvas.width / 2, canvas.height / 2);
            
            this.replace_obj(new THREE.Texture(canvas));
            ThreeView.prototype.update.call(this);
        }
    });
    register['TextTextureView'] = TextTextureView;

    var Basic3dObject = Object3dView.extend({
        render: function() {
            this.update();
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
    register['AmbientLight'] = AmbientLight;

    var DirectionalLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.DirectionalLight(this.model.get('color'),
                                              this.model.get('intensity'));
        }
    });
    register['DirectionalLight'] = DirectionalLight;

    var PointLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.PointLight(this.model.get('color'),
                                        this.model.get('intensity'),
                                        this.model.get('distance'));
        }
    });
    register['PointLight'] = PointLight;

    var SpotLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.SpotLight(this.model.get('color'),
                                       this.model.get('intensity'),
                                       this.model.get('distance'));
        }
    });
    register['SpotLight'] = SpotLight;

    var HemisphereLight = Basic3dObject.extend({
        new_obj: function() {
            return new THREE.HemisphereLight(this.model.get('color'),
                                             this.model.get('ground_color'),
                                             this.model.get('intensity'));
        }
    });
    register['HemisphereLight'] = HemisphereLight;


    /* Extra helpers */
    var SurfaceGridView = MeshView.extend({
        update: function() {
            var that = this;
            // we call this first so this.geometry and this.material are created
            var promise = MeshView.prototype.update.call(this);
            return promise.then(function() {
                // Construct the grid lines from that.geometry.obj
                var vertices = that.geometry.obj.vertices;
                var xpoints = that.geometry.obj.parameters.widthSegments+1;
                var ypoints = that.geometry.obj.parameters.heightSegments+1;
                var g, xi, yi;
                var lines = [];
                var obj = new THREE.Object3D();

                for (xi = 0; xi<xpoints; xi++) {
                    g = new THREE.Geometry();
                    for (yi = 0; yi<ypoints; yi++) {
                        g.vertices.push(vertices[yi*xpoints+xi].clone());
                    }
                    obj.add(new THREE.Line(g, that.material.obj));
                }

                for (yi = 0; yi<ypoints; yi++) {
                    g = new THREE.Geometry();
                    for (xi = 0; xi<xpoints; xi++) {
                        g.vertices.push(vertices[yi*xpoints+xi].clone());
                    }
                    obj.add(new THREE.Line(g, that.material.obj));
                }

                that.replace_obj(obj);
                // Skip the parent to call Object3dView's update, which registers the update
                Object3dView.prototype.update.call(that);
            })
        }
    });
    register['SurfaceGridView'] = SurfaceGridView;

    /* Custom models, which we need for serializing object references */

    register.Object3dModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            children: {deserialize: widget.unpack_models}
        }, widget.WidgetModel.serializers)
    });

    register.ControlsModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            controlling: {deserialize: widget.unpack_models}
        }, widget.WidgetModel.serializers)
    });

    register.PickerModel = register.ControlsModel.extend({}, {
        serializers: _.extend({
            root: {deserialize: widget.unpack_models},
            object: {deserialize: widget.unpack_models},
        }, register.ControlsModel.serializers)
    });

    register.BasicMaterialModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            map: {deserialize: widget.unpack_models},
            lightMap: {deserialize: widget.unpack_models},
            specularMap: {deserialize: widget.unpack_models},
            envMap: {deserialize: widget.unpack_models},
        }, widget.WidgetModel.serializers)
    });

    register.ParticleSystemMaterialModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            map: {deserialize: widget.unpack_models}
        }, widget.WidgetModel.serializers)
    });

    register.SpriteMaterialModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            map: {deserialize: widget.unpack_models}
        }, widget.WidgetModel.serializers)
    });

    register.SpriteModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            material: {deserialize: widget.unpack_models}
        }, register.Object3dModel.serializers)
    });

    register.MeshModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            geometry: {deserialize: widget.unpack_models},
            material: {deserialize: widget.unpack_models},
        }, register.Object3dModel.serializers)
    });

    register.RendererModel = widget.WidgetModel.extend({}, {
        serializers: _.extend({
            scene: {deserialize: widget.unpack_models},
            camera: {deserialize: widget.unpack_models},
            controls: {deserialize: widget.unpack_models},
            effect: {deserialize: widget.unpack_models},
        }, widget.WidgetModel.serializers)
    });


/*    // Modified from jupyter_notebook/static/widgets/js/init.js
    // we probably don't need this anymore, but we should check performance
    // before removing it
    for (var key in register) {
        if (register.hasOwnProperty(key)) {
            var target = module[target_name];
            if (target.prototype instanceof widget.WidgetModel) {
                manager.WidgetManager.register_widget_model(key, target);
            } else if (target.prototype instanceof widget.WidgetView) {
                manager.WidgetManager.register_widget_view(key, target);
            }
        }
    }
*/
    return register;

});
