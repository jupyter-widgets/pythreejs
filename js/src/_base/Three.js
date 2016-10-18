var _ = require('underscore');
var widgets = require("jupyter-js-widgets");
var pkgName = require('../../package.json').name;
var Promise = require('bluebird');

var Enums = require('./enums');

var ThreeCache = {
    byId: {},
    byUuid: {},
    byName: {}
};

var ThreeView = widgets.DOMWidgetView.extend({

    initialize: function () {
        widgets.WidgetView.prototype.initialize.apply(this, arguments);
    },

    render: function() {

        var obj = this.model.obj;

        this.renderer = new THREE.WebGLRenderer({
            // required for converting canvas to png
            preserveDrawingBuffer: true,
        });

        this.el.className = "jupyter-widget jupyter-threejs";
        this.$el.empty().append(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.renderer.domElement.width / this.renderer.domElement.height);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.scene = new THREE.Scene();
        // cameras need to be added to scene
        this.scene.add(this.camera);

        // Allow user to inspect object with mouse/scrollwheel
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // Only animate and enable controls when mouse is over dom element
        this.$el.mouseenter(_.bind(function() {
            this.animate = true;
            this.tick();
        }, this));
        this.$el.mouseleave(_.bind(function() {
            this.animate = false;
        }, this));

        // Lights
        this.pointLight = new THREE.PointLight('#ffffff', 1, 0);
        this.pointLight.position.set(-100, 100, 100);
        this.pointLight.lookAt(new THREE.Vector3(0,0,0));

        this.ambLight = new THREE.AmbientLight('#ffffff', 0.5);

        // this.dirLight = new THREE.DirectionalLight('#ffffff', 0.5);
        // this.dirLight.position.set(-1, 1, 1);

        this.camera.add(this.ambLight);
        this.camera.add(this.pointLight);

        if (this.model.obj) {
            this.constructScene();
            this.renderScene();
        }

        this.on('destroy', this.destroy, this);
        this.listenTo(this.model, 'rerender',   this.renderScene);
        this.listenTo(this.model, 'msg:custom', this.onCustomMessage.bind(this));

    },

    tick: function() {
        this.renderScene();
        if (this.animate) {
            requestAnimationFrame(this.tick.bind(this));
        }
    },

    destroy: function() {
        this.$el.empty();
    },

    setSize: function(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    constructScene: function() {
    
        var obj = this.model.obj; 

        this.clearScene();
        this.scene.add(this.camera);

        if (obj instanceof THREE.Object3D) {

            console.log('render Object3D');
            this.scene.add(obj);
            this.setSize(200, 200);

        } else if (obj instanceof THREE.Geometry || obj instanceof THREE.BufferGeometry) {

            var material = new THREE.MeshStandardMaterial({
                color: '#888888',
            });
            var mesh = new THREE.Mesh(obj, material);
            this.scene.add(mesh);

            this.setSize(200, 200);

        } else if (obj instanceof THREE.Material) {
        
            var geometry = new THREE.SphereGeometry(15, 16, 12);
            var mesh = new THREE.Mesh(geometry, obj);
            this.scene.add(mesh);

            this.setSize(100, 100);

        }

    },

    clearScene: function() {
        this.controls.reset();
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
        console.log('renderScene');
        this.renderer.render(this.scene, this.camera);
    },

    freeze: function() {
        this.$el.empty().append('<img src="' + this.renderer.domElement.toDataURL() + '" />');
    },

    onCustomMessage: function(content, buffers) {
        switch(content.type) {
            case 'freeze':
                this.freeze();
                break;
            default:
        }
    },

});

var ThreeModel = widgets.DOMWidgetModel.extend({

    defaults: _.extend({}, widgets.WidgetModel.prototype.defaults, {
        _model_module: pkgName,
        _view_module: pkgName,
        _model_name: 'ThreeModel',
        _view_name: 'ThreeView'
    }),

    initialize: function(attributes, options) {
        widgets.WidgetModel.prototype.initialize.apply(this, arguments);

        this.createPropertiesArrays();

        // Instantiate Three.js object
        this.createThreeObject();

        // pull in props created by three
        // TODO: need to ensure changes are saved before syncing to three obj
        this.syncToModel();

        // sync the rest from the server to the model
        this.syncToThreeObj();

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

    createPropertiesArrays: function() {
        // initialize properties arrays
        this.three_properties = [];
        this.three_array_properties = [];
        this.three_dict_properties = [];
        this.scalar_properties = [];
        this.enum_properties = [];
        this.color_properties = [];
        this.array_properties = [];
        this.dict_properties = [];
        this.function_properties = [];
        this.properties_properties = [];
        this.vector_properties = [];

        this.enum_property_types = {};
        this.props_created_by_three = {};
    },

    registerChildrenListeners: function() {
        this.three_properties.forEach(function(propName) {
            var childModel = this.get(propName);
            if (childModel) {
                childModel.on('change', this.onChildChanged, this);
            }
        }, this);
        this.three_array_properties.forEach(function(propName) {
            var childArr = this.get(propName);
            if (childArr) {
                childArr.forEach(function(childModel) {
                    childModel.on('change', this.onChildChanged, this);    
                }, this);
            }
        }, this);

        // TODO: dict properties
    },

    createThreeObject: function() {

        var obj;
        var cacheDescriptor = this.getCacheDescriptor();
        if (cacheDescriptor) {
            obj = this.getThreeObjectFromCache(cacheDescriptor); 
            if (obj) {
                if (obj.ipymodelId != this.id) {
                    throw new Error('model id does not match three object: ' + obj.ipymodelId + ' -- ' + this.id);
                }

                this.obj = obj;
                return obj;
            }
        }

        obj = this.constructThreeObject();
        obj.ipymodelId = this.id; // brand that sucker
        obj.ipymodel = this;

        this.putThreeObjectIntoCache(cacheDescriptor, obj);

        // pickers need access to the model from the three.js object
        // TODO: this.obj may not exist until after the update() call above
        // TODO: handle this now that it's in the model
        // this.obj.ipywidget_view = this;

        this.obj = obj;

        return obj;

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

            // TODO: sync new values from object back to model
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

        var arrayMappers = {
            'three_properties': this.syncThreePropToThree,
            'three_array_properties': this.syncThreeArrayToThree,
            'three_dict_properties': this.syncThreeDictToThree,
            'scalar_properties': this.syncScalarToThree,
            'enum_properties': this.syncEnumToThree,
            'color_properties': this.syncColorToThree,
            'array_properties': this.syncArrayToThree,
            'dict_properties': this.syncDictToThree,
            'function_properties': this.syncFunctionToThree,
            'vector_properties': this.syncVectorToThree,
        };

        _.each(arrayMappers, function(mapFn, arrayName) {
            this[arrayName].forEach(function(propName) {
                mapFn.bind(this)(propName); 
            }, this); 
        }, this);

        this.obj.needsUpdate = true;
    },

    syncThreePropToThree: function(propName) {
        var submodel = this.get(propName);

        if (!submodel) {
            this.obj[propName] = null;
        } else {
            var subThreeObj = submodel.obj;
            this.obj[propName] = subThreeObj;
        }
    },
    
    syncThreeArrayToThree: function(propName) {
        var submodelArray = this.get(propName);

        if (!submodelArray) {
            this.obj[propName] = null;
            return;
        }

        this.obj[propName] = _.map(submodelArray, function(submodel) {
            return submodel.obj;
        });
    },
    
    syncThreeDictToThree: function(propName) {
        var submodelDict = this.get(propName);

        if (!submodelDict) {
            this.obj[propName] = null;
            return;
        }

        this.obj[propName] = _.mapObject(submodelDict, function(submodel) {
            return submodel.obj;
        });
    },
    
    syncScalarToThree: function(propName) {
        this.obj[propName] = this.get(propName);
    },
    
    syncEnumToThree: function(propName) {
        this.obj[propName] = THREE[this.get(propName)];
    },
    
    syncColorToThree: function(propName) {
        this.obj[propName].set(this.get(propName));
    },
    
    syncArrayToThree: function(propName) {
        // TODO: is this needed?
        this.obj[propName] = this.get(propName);
    },
    
    syncDictToThree: function(propName) {
        // TODO: is this needed?
        this.obj[propName] = this.get(propName);
    },

    syncFunctionToThree: function(propName) {
        // TODO: is this needed?
        eval('var fn = ' + this.get(propName));
        this.obj[propName] = fn;
    },

    syncVectorToThree: function(propName) {
        var arr = this.get(propName);
        this.obj[propName].fromArray(arr);
    },

    // push data from three object to model
    syncToModel: function(syncAllProps) {

        syncAllProps = syncAllProps == null ? false : syncAllProps;

        var arrayMappers = {
            'three_properties': this.syncThreePropToModel,
            'three_array_properties': this.syncThreeArrayToModel,
            'three_dict_properties': this.syncThreeDictToModel,
            'scalar_properties': this.syncScalarToModel,
            'enum_properties': this.syncEnumToModel,
            'color_properties': this.syncColorToModel,
            'array_properties': this.syncArrayToModel,
            'dict_properties': this.syncDictToModel,
            'function_properties': this.syncFunctionToModel,
            'vector_properties': this.syncVectorToModel,
        };

        _.each(arrayMappers, function(mapFn, arrayName) {
            // class config defines the list of properties that are explicitly
            // set by three.js.  
            // this method will only sync those properties back to the model
            // in order to minimize the number of props set and sent to the server

            var props = this[arrayName];
            if (!syncAllProps) {
                props = props.filter(function(propName) {
                    return (propName in this.props_created_by_three);
                }, this);
            }

            props.forEach(function(propName) {
                mapFn.bind(this)(propName); 
            }, this); 

        }, this);

        this.save_changes();
    },

    syncThreePropToModel: function(propName) {
        // TODO: implement
    },
    
    syncThreeArrayToModel: function(propName) {
        // TODO: implement
    },
    
    syncThreeDictToModel: function(propName) {
        // TODO: implement
    },
    
    syncScalarToModel: function(propName) {
        this.set(propName, this.obj[propName]);
    },
    
    syncEnumToModel: function(propName) {
        var enumType = this.enum_property_types[propName];
        var enumValues = Enums[enumType];
        var enumValueName = enumValues[this.obj[propName]];
        this.set(propName, enumValueName);
    },
    
    syncColorToModel: function(propName) {
        this.set(propName, this.obj[propName].getHexString())
    },
    
    syncArrayToModel: function(propName) {
        this.set(propName, this.obj[propName]);
    },
    
    syncDictToModel: function(propName) {
        this.set(propName, this.obj[propName]);
    },

    syncFunctionToModel: function(propName) {
        this.set(propName, this.obj[propName].toString());
    },

    syncVectorToModel: function(propName) {
        this.set(propName, this.obj[propName].toArray());
    },
 
}, {

    serializers: _.extend({}, widgets.WidgetModel.serializers)

});

module.exports = {
    ThreeView: ThreeView,
    ThreeModel: ThreeModel,
};
