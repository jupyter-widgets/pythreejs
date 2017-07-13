var _ = require('underscore');
var widgets = require("@jupyter-widgets/base");
var Promise = require('bluebird');
var $ = require('jquery');


var Renderable = require('./Renderable');
var RenderableView = Renderable.RenderableView;
var RenderableModel = Renderable.RenderableModel;


var BLACK = new THREE.Color('black');


var PreviewView = RenderableView.extend({

    initialize: function() {
        RenderableView.prototype.initialize.apply(this, arguments);

        this._rebuildNeeded = true;

    },

    render: function() {
        // ensure that model is fully initialized before attempting render
        return this.model.initPromise.bind(this).then(this.doRender);
    },


    setupEventListeners: function() {
        RenderableView.prototype.setupEventListeners.call(this);
        var child = this.model.get('child');
        this.listenTo(child, 'change', this.onChildChange.bind(this));
        if (child.obj instanceof THREE.Object3D) {
            // Since we use clone for objects, we need to rebuild for
            // any nested change instead of just rerendering.
            this.listenTo(child, 'childchange', this.onChildChange.bind(this));
        }
    },

    onChildChange: function() {
        this._rebuildNeeded = true;
    },

    constructScene: function() {

        var obj = this.model.get('child').obj;

        this.clearScene();
        // cameras need to be added to scene
        this.scene.add(this.camera);

        if (obj instanceof THREE.Object3D) {

            this.log('render Object3D');
            // Use a clone to not change `parent` attribute
            this.scene.add(obj.clone());

        } else if (obj instanceof THREE.Geometry || obj instanceof THREE.BufferGeometry) {

            var material;
            if (this.model.get('_flat')) {
                material = new THREE.MeshPhongMaterial({
                    color: '#ffffff',
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
                    color: '#ffffff',
                });
            }

            var mesh = new THREE.Mesh(obj, material);
            this.scene.add(mesh);

        } else if (obj instanceof THREE.Material) {

            if (obj instanceof THREE.SpriteMaterial) {
                var sprite = new THREE.Sprite(obj);
                var maxScale = sprite.position.distanceTo(this.camera.position);
                var aspect = obj.map.image.width / obj.map.image.height;
                if (aspect >= 1) {
                    sprite.scale.set(maxScale, maxScale / aspect, maxScale);
                } else {
                    sprite.scale.set(maxScale * aspect, maxScale, maxScale);
                }
                this.scene.add(sprite);
            } else {
                var geometry = new THREE.SphereGeometry(15, 16, 12);
                var mesh = new THREE.Mesh(geometry, obj);
                this.scene.add(mesh);
            }

        } else if (obj instanceof THREE.Texture) {

            var geometry = new THREE.SphereGeometry(15, 16, 12);
            var mat = new THREE.MeshStandardMaterial({ map: obj });
            var mesh = new THREE.Mesh(geometry, mat);
            this.scene.add(mesh);

        }

        // Clear at end to ensure that any changes to obj does not
        // cause infinite rebuild chain.
        this._rebuildNeeded = false;
    },

    clearScene: function() {
        // this.controls.reset();
        this.scene.children.forEach(function(child) {
            this.scene.remove(child);
        }, this);
    },

    setupControls: function() {
        // Allow user to inspect object with mouse/scrollwheel
        this.log('setting up controls');
        var control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        control.target.set(0, 0, 0);
        control.update();
        this.controls = [control];
    },

    lazyRendererSetup: function() {
        this.camera = new THREE.PerspectiveCamera(60, 1.0); // aspect is updated by this.updateSize()
        this.camera.position.set(-40, 40, 40);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        // Update aspect ratio of camera:
        this.updateSize();

        this.scene = new THREE.Scene();

        // Overrides clear color of renderer:
        this.scene.background = BLACK;

        // Lights
        this.pointLight = new THREE.PointLight('#ffffff', 1, 0);
        this.pointLight.position.set(-100, 100, 100);
        this.pointLight.lookAt(new THREE.Vector3(0,0,0));
        this.ambLight = new THREE.AmbientLight('#ffffff', 0.5);
        this.camera.add(this.ambLight);
        this.camera.add(this.pointLight);

        this.setupControls();
        this.enableControls();

        this.renderScene();
    },

    renderScene: function() {
        this.log('renderScene');

        // TODO: check renderer.domElement.isContextLost()

        if (this.isFrozen) {
            this.unfreeze();
        }
        if (this._rebuildNeeded) {
            this.constructScene();
        }

        this.renderer.render(this.scene, this.camera);
    },

    updateSize: function() {
        RenderableView.prototype.updateSize.call(this);
        if (this.camera) {
            var width = this.model.get('_width');
            var height = this.model.get('_height');
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    },

});


var PreviewModel = RenderableModel.extend({

    defaults: function() {
        return _.extend(RenderableModel.prototype.defaults.call(this), {
            _model_name: 'PreviewModel',
            _view_name: 'PreviewView',

            _flat: false,
            _wire: false,
            child: null,
        });
    },

    initialize: function(attributes, options) {
        RenderableModel.prototype.initialize.apply(this, arguments);

        // Don't listen to child until it is finished it's setup
        this.initPromise = this.get('child').initPromise.bind(this).then(function() {
            this.setupListeners();
        });
    },

    setupListeners: function() {
        var child = this.get('child');
        this.listenTo(child, 'change', this.onChildChange.bind(this));
        this.listenTo(child, 'childchange', this.onChildChange.bind(this));
    },

    onChildChange: function(model, options) {
        this.trigger('rerender', this, {});
    },

}, {

    serializers: _.extend({
        child: { deserialize: widgets.unpack_models },
    }, RenderableModel.serializers),

});


module.exports = {
    PreviewModel: PreviewModel,
    PreviewView: PreviewView,
};
