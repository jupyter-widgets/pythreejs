var _ = require('underscore');
var widgets = require("jupyter-js-widgets");
var pkgName = require('../../package.json').name;

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

        this.renderer = new THREE.WebGLRenderer();
        this.el.className = "jupyter-widget jupyter-threejs";
        this.$el.empty().append(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.renderer.domElement.width / this.renderer.domElement.height);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.ambLight = new THREE.AmbientLight('#ffffff', 0.5);
        this.dirLight = new THREE.DirectionalLight('#ffffff', 0.5);
        this.dirLight.position.set(-1, 1, 1);

        if (this.model.obj) {
            this.constructScene();
            this.renderScene();
        }

    },

    setSize: function(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    constructScene: function() {
    
        var obj = this.model.obj; 
        this.clearScene();

        this.scene.add(this.camera, this.ambLight, this.dirLight);

        if (obj instanceof THREE.Mesh) {

            this.scene.add(obj);
            this.setSize(200, 200);

        } else if (obj instanceof THREE.Geometry || obj instanceof THREE.BufferGeometry) {

            var material = new THREE.MeshStandardMaterial({
                color: '#ff0000',
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
        this.createThreeObject();
        this.syncToThreeObj();

        this.on('change', this.syncToThreeObj, this);
    
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
        this.vector_properties = [];

        this.enum_property_types = {};
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

    constructThreeObject: function() {
    
    },

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
    // Data-binding methods for syncing between model and three.js object
    //

    // push data from model to three object
    syncToThreeObj: function() {
        this.three_properties.forEach(this.syncThreePropToThree.bind(this)); 
        this.three_array_properties.forEach(this.syncThreeArrayToThree.bind(this)); 
        this.three_dict_properties.forEach(this.syncThreeDictToThree.bind(this)); 
        this.scalar_properties.forEach(this.syncScalarToThree.bind(this)); 
        this.enum_properties.forEach(this.syncEnumToThree.bind(this)); 
        this.color_properties.forEach(this.syncColorToThree.bind(this)); 
        this.array_properties.forEach(this.syncArrayToThree.bind(this)); 
        this.vector_properties.forEach(this.syncVectorToThree.bind(this)); 

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
    
    syncVectorToThree: function(propName) {
        var arr = this.get(propName);
        this.obj[propName].fromArray(arr);
    },

    // push data from three object to model
    syncToModel: function() {
        this.three_properties.forEach(this.syncThreePropToModel.bind(this)); 
        this.three_array_properties.forEach(this.syncThreeArrayToModel.bind(this)); 
        this.three_dict_properties.forEach(this.syncThreeDictToModel.bind(this)); 
        this.scalar_properties.forEach(this.syncScalarToModel.bind(this)); 
        this.enum_properties.forEach(this.syncEnumToModel.bind(this)); 
        this.color_properties.forEach(this.syncColorToModel.bind(this)); 
        this.array_properties.forEach(this.syncArrayToModel.bind(this)); 
        this.vector_properties.forEach(this.syncVectorToModel.bind(this)); 

        this.save_changes();
    },

    syncThreePropToModel: function(propName) {
        
    },
    
    syncThreeArrayToModel: function(propName) {
    
    },
    
    syncThreeDictToModel: function(propName) {
    
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
