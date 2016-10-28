var _ = require('underscore');
var widgets = require("jupyter-js-widgets");
var pkgName = require('../../package.json').name;
var Promise = require('bluebird');
var $ = require('jquery');

var RendererPool = require('./RendererPool');

var Enums = require('./enums');

var ThreeCache = {
    byId: {},
    byUuid: {},
    byName: {}
};

var ThreeView = widgets.DOMWidgetView.extend({

    initialize: function () {
        widgets.WidgetView.prototype.initialize.apply(this, arguments);

        // starts as "frozen" until renderer is acquired
        this.isFrozen = true;
        this.id = Math.floor(Math.random() * 1000000);
    },

    remove: function() {
        widgets.DOMWidgetView.prototype.remove.apply(this, arguments);

        if (!this.isFrozen) {
            RendererPool.release(this.renderer);
            this.renderer = null;
            this.isFrozen = true;
        }
    },

    render: function() {
        // ensure that model is fully initialized before attempting render
        this.model.initPromise.bind(this).then(this.doRender);
    },

    doRender: function() {
        var obj = this.model.obj;

        this.el.className = "jupyter-widget jupyter-threejs";

        this.acquireRenderer();

        this.camera = new THREE.PerspectiveCamera(60, 1.0); // aspect is updated by this.updateSize()
        this.camera.position.set(-40, 40, 40);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.updateSize();
        
        this.scene = new THREE.Scene();
        // cameras need to be added to scene
        this.scene.add(this.camera);

        // Lights
        this.pointLight = new THREE.PointLight('#ffffff', 1, 0);
        this.pointLight.position.set(-100, 100, 100);
        this.pointLight.lookAt(new THREE.Vector3(0,0,0));
        this.ambLight = new THREE.AmbientLight('#ffffff', 0.5);
        this.camera.add(this.ambLight);
        this.camera.add(this.pointLight);
        
        this.setupControls();

        if (this.model.obj) {
            this.constructScene();
            this.renderScene();
        }

        this.on('destroy', this.destroy, this);
        this.listenTo(this.model, 'rerender',       this.renderScene);
        this.listenTo(this.model, 'msg:custom',     this.onCustomMessage.bind(this));

        this.listenTo(this.model, 'change:_width',  this.updateSize.bind(this));
        this.listenTo(this.model, 'change:_height', this.updateSize.bind(this));
    },

    tick: function() {
        this.renderScene();
        if (this.animate) {
            requestAnimationFrame(this.tick.bind(this));
        }
    },

    destroy: function() {
        this.$el.empty();
        if (!this.isFrozen) {
            this.teardownViewer();
        }
    },

    updateSize: function() {
        var width = this.model.get('_width');
        var height = this.model.get('_height');
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    constructScene: function() {
    
        var obj = this.model.obj; 

        this.clearScene();
        this.scene.add(this.camera);

        if (obj instanceof THREE.Object3D) {

            this.log('render Object3D');
            this.scene.add(obj);

        } else if (obj instanceof THREE.Geometry || obj instanceof THREE.BufferGeometry) {

            var material;
            if (this.model.get('_flat')) {
                material = new THREE.MeshPhongMaterial({
                    color: '#888888',
                    shading: THREE.FlatShading,
                });
            } else if (this.model.get('_wire') || obj instanceof THREE.WireframeGeometry) {
                material = new THREE.MeshBasicMaterial({
                    color: '#888888',
                    wireframe: true,
                    shading: THREE.FlatShading,
                });
            } else {
                material = new THREE.MeshStandardMaterial({
                    color: '#888888',
                });
            }

            var mesh = new THREE.Mesh(obj, material);
            this.scene.add(mesh);

        } else if (obj instanceof THREE.Material) {
        
            var geometry = new THREE.SphereGeometry(15, 16, 12);
            var mesh = new THREE.Mesh(geometry, obj);
            this.scene.add(mesh);

        } else if (obj instanceof THREE.Texture) {

            var geometry = new THREE.SphereGeometry(15, 16, 12);
            var mat = new THREE.MeshStandardMaterial({ map: obj });
            var mesh = new THREE.Mesh(geometry, mat);
            this.scene.add(mesh);

        }

    },

    clearScene: function() {
        // this.controls.reset();
        this.scene.children.forEach(function(child) {
            this.scene.remove(child);
        }, this);
    },

    update: function() {

        widgets.WidgetView.prototype.update.apply(this, arguments);

        if (this.model.obj) {
            this.constructScene();
        }
        this.renderScene();

    },

    renderScene: function() {
        this.log('renderScene');

        // TODO: check renderer.domElement.isContextLost()

        if (this.isFrozen) {
            this.log('renderScene->isFrozen');

            this.acquireRenderer();
            this.updateSize();
            this.setupControls();

            if (this.model.obj) {
                this.constructScene();
            }
        }

        this.renderer.render(this.scene, this.camera);
    },

    teardownViewer: function() {

        this.$renderer.off('mouseenter');
        this.$renderer.off('mouseleave');

        this.$renderer = null;
        this.renderer = null;

        this.disposeControls();

        this.$el.css('margin-bottom', 'auto');

        this.isFrozen = true;

    },

    acquireRenderer: function() {
        if (!this.isFrozen) {
            return;
        }

        this.log('ThreeView.acquiring...');

        if(this.$frozenRenderer) {
            this.$frozenRenderer.off('mouseenter');
            this.$frozenRenderer = null;
        }

        this.renderer = RendererPool.acquire(this.onRendererReclaimed.bind(this));
        this.$renderer = $(this.renderer.domElement);
        this.$el.empty().append(this.$renderer);
        this.$el.css('margin-bottom', '-5px');

        this.log('ThreeView.acquireRenderer(' + this.renderer.poolId + ')');

        this.isFrozen = false;

        this.$renderer.on('mouseenter', _.bind(function() {
            this.animate = true;
            this.tick();
        }, this));
        this.$renderer.on('mouseleave', _.bind(function() {
            this.animate = false;
        }, this));
    
    },

    freeze: function() {
        if (this.isFrozen) {
            this.log('already frozen...');
            return;
        }

        this.log('ThreeView.freeze(id=' + this.renderer.poolId + ')');
        
        this.animate = false;
        this.$el.empty().append('<img src="' + this.renderer.domElement.toDataURL() + '" />');
        
        this.teardownViewer();
        this.isFrozen = true;
        
        this.$frozenRenderer = this.$el.find('img');
        this.$frozenRenderer.on('mouseenter', _.bind(function() {
            this.log('frozenRenderer.mouseenter');
            this.animate = true;
            this.tick(); // renderer will be acquired by renderScene
        }, this));
    
    },

    setupControls: function() {
        // Allow user to inspect object with mouse/scrollwheel
        this.log('setting up controls');
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    },

    disposeControls: function() {
        this.log('disposing controls');
        if (this.controls) {
            // this.controls.reset();
            this.controls.dispose();
            this.controls = null;
        } else {
            this.log('this.controls is null');
        }
    },

    onCustomMessage: function(content, buffers) {
        switch(content.type) {
            case 'freeze':
                this.freeze();
                break;
            default:
        }
    },

    onRendererReclaimed: function() {
        this.log('ThreeView WebGL context is being reclaimed: ' + this.renderer.poolId);
        this.freeze();
    },

    log: function(str) {
        console.log('TV(' + this.id + '): ' + str);
    }

});

var ThreeModel = widgets.DOMWidgetModel.extend({

    defaults: _.extend({}, widgets.WidgetModel.prototype.defaults, {
        _model_module: pkgName,
        _view_module: pkgName,
        _model_name: 'ThreeModel',
        _view_name: 'ThreeView',

        _width: 200,
        _height: 200,
        _flat: false,
        _wire: false,
    }),

    initialize: function(attributes, options) {
        widgets.WidgetModel.prototype.initialize.apply(this, arguments);

        this.createPropertiesArrays();

        // Instantiate Three.js object
        this.initPromise = this.createThreeObjectAsync().bind(this).then(function() {

            // pull in props created by three
            // TODO: need to ensure changes are saved before syncing to three obj
            this.syncToModel();

            // sync the rest from the server to the model
            this.syncToThreeObj();

            // setup msg, model, and children change listeners
            this.setupListeners();

        });
    
    },

    createPropertiesArrays: function() {
        // initialize properties arrays
        this.three_properties = [];
        this.three_array_properties = [];
        this.three_dict_properties = [];
        // this.scalar_properties = [];
        // this.enum_properties = [];
        // this.color_properties = [];
        // this.array_properties = [];
        // this.dict_properties = [];
        // this.function_properties = [];
        // this.properties_properties = [];
        // this.vector_properties = [];

        this.enum_property_types = {};
        this.props_created_by_three = {};
        this.property_converters = {};
        this.property_mappers = {};
    },

    setupListeners: function() {

        // Handle changes in three instance props
        this.three_properties.forEach(function(propName) {
            // register listener for current child value
            var curValue = this.get(propName);
            if (curValue) {
                this.listenTo(curValue, 'change', this.onChildChanged);
            }

            // make sure to un/hook listeners when child points to new object
            this.on('change:' + propName, function(model, value, options) {
                var prevModel = this.previous(propName);
                var currModel = value;
                if (prevModel) {
                    this.stopListening(prevModel);
                }
                if (currModel) {
                    this.listenTo(currModel, 'change', this.onChildChanged);
                }
            }, this);
        }, this);

        // Handle changes in three instance array props
        this.three_array_properties.forEach(function(propName) {

            // listen to current values in array
            var currArr = this.get(propName) || [];
            currArr.forEach(function(childModel) {
                this.listenTo(childModel, 'change', this.onChildChanged);
            }, this);

            // make sure to un/hook listeners when array changes
            this.on('change:' + propName, function(model, value, options) {
                var prevArr = this.previous(propName) || [];
                var currArr = value || [];

                var added = _.difference(currArr, prevArr);
                var removed = _.difference(prevArr, currArr);

                added.forEach(function(childModel) {
                    this.listenTo(childModel, 'change', this.onChildChanged);
                }, this);
                removed.forEach(function(childModel) {
                    this.stopListening(childModel);
                }, this);
            }, this);
        }, this);

        // TODO: handle dicts of children

        this.on('change', this.onChange, this);
        this.on('msg:custom', this.onCustomMessage, this);

    },

    createThreeObjectAsync: function() {

        // try cache first
        var cacheDescriptor = this.getCacheDescriptor();
        if (cacheDescriptor) {
            var obj = this.getThreeObjectFromCache(cacheDescriptor); 
            if (obj) {
                if (obj.ipymodelId != this.id) {
                    throw new Error('model id does not match three object: ' + obj.ipymodelId + ' -- ' + this.id);
                }

                this.obj = obj;
                return Promise.resolve(obj);
            }
        }

        var objPromise;

        // call constructor method overridden by every class
        // check for custom async three obj creator
        if (this.constructThreeObjectAsync) {
            objPromise = this.constructThreeObjectAsync();
        } else if (this.constructThreeObject) {
            objPromise = Promise.resolve(this.constructThreeObject());
        } else {
            throw new Error('no THREE construct method exists: this.createThreeObjectAsync');
        }

        return objPromise.bind(this).then(function(obj) {
            
            obj.ipymodelId = this.id; // brand that sucker
            obj.ipymodel = this;

            this.putThreeObjectIntoCache(cacheDescriptor, obj);

            // pickers need access to the model from the three.js object
            // TODO: this.obj may not exist until after the update() call above
            // TODO: handle this now that it's in the model
            // this.obj.ipywidget_view = this;

            this.obj = obj;
            return obj;

        });

    },

    // Over-ride this method to customize how THREE object is created

    constructThreeObject: function() {},

    // 
    // Three.js object cache methods
    //

    getCacheDescriptor: function() {

        var id = this.id;
        if (id != null) {
            return { id: id };
        }

        return;

    },

    getThreeObjectFromCache: function(cacheDescriptor) {
        if (cacheDescriptor.id) {
            return ThreeCache.byId[cacheDescriptor.id];
        } else if (cacheDescriptor.uuid) {
            return ThreeCache.byUuid[cacheDescriptor.uuid];
        } else if (cacheDescriptor.name) {
            return ThreeCache.byName[cacheDescriptor.name];
        }
    },

    putThreeObjectIntoCache: function(cacheDescriptor, obj) {
        if (cacheDescriptor.id) {
            ThreeCache.byId[cacheDescriptor.id] = obj;
        } else if (cacheDescriptor.uuid) {
            ThreeCache.byUuid[cacheDescriptor.uuid] = obj;
        } else if (cacheDescriptor.name) {
            ThreeCache.byName[cacheDescriptor.name] = obj;
        }
    },  

    //
    // Remote execution of three.js object methods
    //

    onCustomMessage: function(content, buffers) {
        switch(content.type) {
            case 'exec_three_obj_method':
                this.onExecThreeObjMethod(content.method_name, content.args, content.buffers);
                break;
            case 'freeze':
                break;
            case 'print':
                console.log("SERVER: " + JSON.stringify(content.msg));
                break;
            default:
                console.log("ERROR: invalid custom message");
                console.log(content);

        }
    },

    onExecThreeObjMethod: function(methodName, args, buffers) {
        console.log('execThreeObjMethod: ' + methodName + 
            '(' + args.map(JSON.stringify).join(',') + ')');

        if (!(methodName in this.obj)) {
            throw new Error('Invalid methodName: ' + methodName);
        }

        // convert serialized args to three.js compatible values
        args = args.map(function(arg) {

            if (arg instanceof Array) {

                if (arg.length === 2) {
                    return new THREE.Vector2().fromArray(arg);
                } else if (arg.length === 3) {
                    return new THREE.Vector3().fromArray(arg);
                } else if (arg.length === 4) {
                    return new THREE.Vector4().fromArray(arg);
                } else if (arg.length === 9) {
                    return new THREE.Matrix3().fromArray(arg);
                } else if (arg.length === 16) {
                    return new THREE.Matrix4().fromArray(arg);
                } else {
                    return arg;
                }
            
            } else if (arg instanceof String && /IPY_MODEL_/.test(arg)) {

                arg = arg.replace('IPY_MODEL_', '');
                return this.widget_manager.get_model(arg).then(function(model) {
                    return model.obj;
                });
                
            } else {
                return arg;
            }
        
        }, this);

        return Promise.all(args).bind(this).then(function(args) {
            
            var retVal = this.obj[methodName].apply(this.obj, args);

            this.syncToModel(true);

            if (retVal != null) {

                if (retVal.ipymodel) {
                    retVal = retVal.ipymodel;
                }

                console.log('sending return value to server...');
                this.send({
                    type: "exec_three_obj_method_retval",
                    method_name: methodName,
                    ret_val: retVal,
                }, this.callbacks(), null);
            }

        });

    },

    //
    // Data-binding methods for syncing between model and three.js object
    //

    onChange: function(model, options) {
        // console.log(this.id + ' onChange: ');
        // console.log(this.changedAttributes());

        this.syncToThreeObj();
        this.trigger('rerender', this, {});
    },

    onChildChanged: function(model, options) {
        console.log('child changed: ' + model.id);
        this.trigger('rerender', this, {});
    },

    // push data from model to three object
    syncToThreeObj: function() {

        // var arrayMappers = {
        //     'three_properties': this.syncThreePropToThree,
        //     'three_array_properties': this.syncThreeArrayToThree,
        //     'three_dict_properties': this.syncThreeDictToThree,
        //     'scalar_properties': this.syncScalarToThree,
        //     'enum_properties': this.syncEnumToThree,
        //     'color_properties': this.syncColorToThree,
        //     'array_properties': this.syncArrayToThree,
        //     'dict_properties': this.syncDictToThree,
        //     'function_properties': this.syncFunctionToThree,
        //     'vector_properties': this.syncVectorToThree,
        // };

        _.each(this.property_converters, function(converterName, propName) {
            if (!converterName) {
                this.obj[propName] = this.get(propName);
                return;
            }

            converterName = converterName + "ModelToThree";
            var converterFn = this[converterName];
            if (!converterFn) {
                throw new Error('invalid converter name: ' + converterName);
            }

            this.obj[propName] = converterFn.bind(this)(this.get(propName), propName);
        }, this);

        // mappers are used for more complicated conversions between model and three props
        // see: DataTexture
        _.each(this.property_mappers, function(mapperName, dataKey) {
            if (!mapperName) {
                throw new Error('invalid mapper name: ' + mapperName);
            }

            mapperName = mapperName + "ModelToThree";
            var mapperFn = this[mapperName];
            if (!mapperFn) {
                throw new Error('invalid mapper name: ' + mapperName);
            }

            mapperFn.bind(this)();
        }, this);

        // _.each(arrayMappers, function(mapFn, arrayName) {
        //     this[arrayName].forEach(function(propName) {
        //         mapFn.bind(this)(propName); 
        //     }, this); 
        // }, this);

        this.obj.needsUpdate = true;
    },

    // syncThreePropToThree: function(propName) {
    //     var submodel = this.get(propName);

    //     if (!submodel) {
    //         this.obj[propName] = null;
    //     } else {
    //         var subThreeObj = submodel.obj;
    //         this.obj[propName] = subThreeObj;
    //     }
    // },
    
    // syncThreeArrayToThree: function(propName) {
    //     var submodelArray = this.get(propName);

    //     if (!submodelArray) {
    //         this.obj[propName] = null;
    //         return;
    //     }

    //     this.obj[propName] = _.map(submodelArray, function(submodel) {
    //         return submodel.obj;
    //     });
    // },
    
    // syncThreeDictToThree: function(propName) {
    //     var submodelDict = this.get(propName);

    //     if (!submodelDict) {
    //         this.obj[propName] = null;
    //         return;
    //     }

    //     this.obj[propName] = _.mapObject(submodelDict, function(submodel) {
    //         return submodel.obj;
    //     });
    // },
    
    // syncScalarToThree: function(propName) {
    //     this.obj[propName] = this.get(propName);
    // },
    
    // syncEnumToThree: function(propName) {
    //     this.obj[propName] = THREE[this.get(propName)];
    // },
    
    // syncColorToThree: function(propName) {
    //     this.obj[propName].set(this.get(propName));
    // },
    
    // syncArrayToThree: function(propName) {
    //     // TODO: is this needed?
    //     this.obj[propName] = this.get(propName);
    // },
    
    // syncDictToThree: function(propName) {
    //     // TODO: is this needed?
    //     this.obj[propName] = this.get(propName);
    // },

    // syncFunctionToThree: function(propName) {
    //     // TODO: is this needed?
    //     eval('var fn = ' + this.get(propName));
    //     this.obj[propName] = fn;
    // },

    // syncVectorToThree: function(propName) {
    //     var arr = this.get(propName);
    //     this.obj[propName].fromArray(arr);
    // },

    // push data from three object to model
    syncToModel: function(syncAllProps) {

        syncAllProps = syncAllProps == null ? false : syncAllProps;

        // var arrayMappers = {
        //     'three_properties': this.syncThreePropToModel,
        //     'three_array_properties': this.syncThreeArrayToModel,
        //     'three_dict_properties': this.syncThreeDictToModel,
        //     'scalar_properties': this.syncScalarToModel,
        //     'enum_properties': this.syncEnumToModel,
        //     'color_properties': this.syncColorToModel,
        //     'array_properties': this.syncArrayToModel,
        //     'dict_properties': this.syncDictToModel,
        //     'function_properties': this.syncFunctionToModel,
        //     'vector_properties': this.syncVectorToModel,
        // };

        _.each(this.property_converters, function(converterName, propName) {
            if (!syncAllProps && !(propName in this.props_created_by_three)) {
                return;
            }

            if (!converterName) {
                this.set(propName, this.obj[propName]);
                return;
            }

            converterName = converterName + 'ThreeToModel';
            var converterFn = this[converterName];
            if (!converterFn) {
                throw new Error('invalid converter name: ' + converterName);
            }

            this.set(propName, converterFn.bind(this)(this.obj[propName], propName));
        }, this);

        // mappers are used for more complicated conversions between model and three props
        // see: DataTexture
        _.each(this.property_mappers, function(mapperName, dataKey) {
            if (!mapperName) {
                throw new Error('invalid mapper name: ' + mapperName);
            }

            mapperName = mapperName + 'ThreeToModel';
            var mapperFn = this[mapperName];
            if (!mapperFn) {
                throw new Error('invalid mapper name: ' + mapperName);
            }

            mapperFn.bind(this)();
        }, this);

        // _.each(arrayMappers, function(mapFn, arrayName) {
        //     // class config defines the list of properties that are explicitly
        //     // set by three.js.  
        //     // this method will only sync those properties back to the model
        //     // in order to minimize the number of props set and sent to the server

        //     var props = this[arrayName];
        //     if (!syncAllProps) {
        //         props = props.filter(function(propName) {
        //             return (propName in this.props_created_by_three);
        //         }, this);
        //     }

        //     props.forEach(function(propName) {
        //         mapFn.bind(this)(propName); 
        //     }, this); 

        // }, this);

        this.save_changes();
    },

    // syncThreePropToModel: function(propName) {
    //     // TODO: implement
    // },
    
    // syncThreeArrayToModel: function(propName) {
    //     // TODO: implement
    // },
    
    // syncThreeDictToModel: function(propName) {
    //     // TODO: implement
    // },
    
    // syncScalarToModel: function(propName) {
    //     this.set(propName, this.obj[propName]);
    // },
    
    // syncEnumToModel: function(propName) {
    //     var enumType = this.enum_property_types[propName];
    //     var enumValues = Enums[enumType];
    //     var enumValueName = enumValues[this.obj[propName]];
    //     this.set(propName, enumValueName);
    // },
    
    // syncColorToModel: function(propName) {
    //     this.set(propName, this.obj[propName].getHexString())
    // },
    
    // syncArrayToModel: function(propName) {
    //     this.set(propName, this.obj[propName]);
    // },
    
    // syncDictToModel: function(propName) {
    //     this.set(propName, this.obj[propName]);
    // },

    // syncFunctionToModel: function(propName) {
    //     this.set(propName, this.obj[propName].toString());
    // },

    // syncVectorToModel: function(propName) {
    //     this.set(propName, this.obj[propName].toArray());
    // },

    //
    // Conversions
    //

    // Enum
    convertEnumModelToThree: function(e, propName) {
        return THREE[e];
    },

    convertEnumThreeToModel: function(e, propName) {
        var enumType = this.enum_property_types[propName];
        var enumValues = Enums[enumType];
        var enumValueName = enumValues[this.obj[propName]];
        return enumValueName;
    },

    // Vectors
    convertVectorModelToThree: function(v, propName) {
        var result;
        switch(v.length) {
            case 2: result = new THREE.Vector2(); break;
            case 3: result = new THREE.Vector3(); break;
            case 4: result = new THREE.Vector4(); break;
            default:
                throw new Error('model vector has invalid length: ' + v.length); 
        }
        result.fromArray(v);
        return result;
    },

    convertVectorThreeToModel: function(v, propName) {
        return v.toArray();
    },

    // Vector Array
    convertVectorArrayModelToThree: function(varr, propName) {
        return varr.map(function(v) {
            return this.convertVectorModelToThree(v, propName);
        }, this);
    },

    convertVectorArrayThreeToModel: function(varr, propName) {
        return varr.map(function(v) {
            return this.convertVectorThreeToModel(v, propName);
        }, this);
    },

    // Color Array
    convertColorArrayModelToThree: function(carr, propName) {
        return carr.map(function(c) {
            return this.convertColorModelToThree(c, propName);
        }, this);
    },

    convertColorArrayThreeToModel: function(carr, propName) {
        return carr.map(function(c) {
            return this.convertColorThreeToModel(c, propName);
        }, this);
    },

    // Faces
    convertFaceModelToThree: function(f, propName) {
        var result = new THREE.Face3(
            f[0],                                   // a
            f[1],                                   // b
            f[2],                                   // c
            this.convertVectorModelToThree(f[3]),   // normal
            new THREE.Color(f[4]),                  // color
            f[5]                                    // materialIndex    
        );

        result.vertexNormals = this.convertVectorArrayModelToThree(f[6]); // vertexNormals
        result.vertexColors = this.convertColorArrayModelToThree(f[7]);   // vertexColors

        return result;
    },

    convertFaceThreeToModel: function(f, propName) {
        return [
            f.a,
            f.b,
            f.c,
            f.normal.toArray(),
            this.convertColorThreeToModel(f.color),
            f.materialIndex,
            this.convertVectorArrayThreeToModel(f.vertexNormals),
            this.convertColorArrayThreeToModel(f.vertexColors),
        ];
    },

    // Face Array
    convertFaceArrayModelToThree: function(farr, propName) {
        return farr.map(function(f) {
            return this.convertFaceModelToThree(f, propName);
        }, this);  
    },

    convertFaceArrayThreeToModel: function(farr, propName) {
        return farr.map(function(f) {
            return this.convertFaceThreeToModel(f, propName);
        }, this);  
    },

    // Matrices
    convertMatrixModelToThree: function(m, propName) {
        var result;
        switch(m.length) {
            case 9: result = new THREE.Matrix3(); break;
            case 16: result = new THREE.Matrix4(); break;
            default:
                throw new Error('model matrix has invalid length: ' + m.length);
        }
        result.fromArray(m);
        return result;
    },

    convertMatrixThreeToModel: function(m, propName) {
        return m.toArray();
    },

    // Functions
    convertFunctionModelToThree: function(fnStr, propName) {
        eval('var fn = ' + fnStr);
        return fn;
    },

    convertFunctionThreeToModelToThree: function(fn, propName) {
        return fn.toString();
    },

    // ThreeType
    convertThreeTypeModelToThree: function(model, propName) {
        if (model) {
            return model.obj;    
        }
        return null;
    },

    convertThreeTypeThreeToModel: function(threeType, propName) {
        return threeType.ipyModel;
    },

    // ThreeTypeArray
    convertThreeTypeArrayModelToThree: function(modelArr, propName) {
        return modelArr.map(function(model) {
            return this.convertThreeTypeModelToThree(model, propName);
        }, this);
    },

    convertThreeTypeArrayThreeToModel: function(threeTypeArr, propName) {
        return threeTypeArr.map(function(threeType) {
            return this.convertThreeTypeThreeToModel(threeType, propName);
        }, this);
    },

    // ThreeTypeDict
    convertThreeTypeDictModelToThree: function(modelDict, propName) {
        return _.mapObject(modelDict, function(model, name) {
            return this.convertThreeTypeModelToThree(model, propName);
        }, this);
    },

    convertThreeTypeDictThreeToModel: function(threeTypeDict, propName) {
        return _.mapObject(threeTypeDict, function(threeType, name) {
            return this.convertThreeTypeThreeToModel(threeType, propName);
        }, this);
    },

    // ArrayBuffer
    convertArrayBufferModelToThree: function(arr, propName) {
        // TODO: support other ArrayBuffer types
        return new Float32Array(arr);
    },

    convertArrayBufferThreeToModel: function(arrBuffer, propName) {
        // TODO: support other ArrayBuffer types
        return Array.prototype.slice.call(arrBuffer);
    },

    // Color
    convertColorModelToThree: function(c, propName) {
        return new THREE.Color(c);
    },

    convertColorThreeToModel: function(c, propName) {
        return "#" + c.getHexString();
    },

    // BufferAttribute
    convertBufferAttributeModelToThree: function(ba, propName) {
        
        // null array means null attribute
        // this is necessary because plain Tuple traits cannot set allow_none=True
        if (!ba[0]) {
            return null;
        }

        var uuid = ba[3];
        var cached = this.getThreeObjectFromCache({ uuid: uuid });
        var result;
        if (cached) {
            result = cached;

            // TODO: currently array and itemsize cannot be changed
            // result.array = new Float32Array(ba[0]);
            // result.itemSize = ba[1];
        } else {
            result = new THREE.BufferAttribute(
                ba[0], // array
                ba[1]  // itemSize
            );
            this.putThreeObjectIntoCache({ uuid: result.uuid }, result);
        }

        result.dynamic = ba[2];
        result.uuid = ba[3];
        result.version = ba[4];
        result.needsUpdate = true;

        return result;
    },

    convertBufferAttributeThreeToModel: function(ba, propName) {
        if (!ba || !ba.array) {
            return [ null, -1, false, '', -1 ];
        }

        // make sure buffer attributes are cached before sending on
        this.putThreeObjectIntoCache({ uuid: ba.uuid }, ba);

        return [
            Array.prototype.slice.call(ba.array),
            ba.itemSize,
            ba.dynamic,
            ba.uuid,
            ba.version
        ];
    },

    // BufferAttributeDict
    convertBufferAttributeDictModelToThree: function(baList, propName) {
        return _.reduce(baList, function(result, ba, name) {
            result[ba[0]] = this.convertBufferAttributeModelToThree(ba[1], propName);
            return result;
        }, {}, this);
    },

    convertBufferAttributeDictThreeToModel: function(baDict, propName) {
        return _.map(baDict, function(ba, name) {
            return [ name, this.convertBufferAttributeThreeToModel(ba, propName) ];
        }, this);
    },
 
}, {

    serializers: _.extend({}, widgets.WidgetModel.serializers)

});

module.exports = {
    ThreeView: ThreeView,
    ThreeModel: ThreeModel,
};
