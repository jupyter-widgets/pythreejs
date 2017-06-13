var _ = require('underscore');
var widgets = require("@jupyter-widgets/base");
var Promise = require('bluebird');
var $ = require('jquery');


var Renderable = require('./Renderable');
var RenderableView = Renderable.RenderableView;
var RenderableModel = Renderable.RenderableModel;


var PreviewView = RenderableView.extend({

    render: function() {
        // ensure that model is fully initialized before attempting render
        return this.model.initPromise.bind(this).then(this.doRender);
    },

    constructScene: function() {

        var obj = this.model.get('child').obj;

        this.clearScene();
        this.scene.add(this.camera);

        if (obj instanceof THREE.Object3D) {

            this.log('render Object3D');
            this.scene.add(obj);

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

        RenderableView.prototype.update.apply(this, arguments);

        if (this.model.get('child').obj) {
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
            this.enableControls();

            if (this.model.get('child').obj) {
                this.constructScene();
            }
        }

        this.renderer.render(this.scene, this.camera);
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
        this.enableControls();

        if (this.model.get('child').obj) {
            this.constructScene();
            this.renderScene();
        }
    },

    updateSize: function() {
        RenderableView.prototype.updateSize.call(this);
        var width = this.model.get('_width');
        var height = this.model.get('_height');
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        var cameraModel = this.model.get('camera');
        cameraModel.set({
            aspect: cameraModel.obj.aspect,
        });
        this.tick();
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

        this.initPromise = this.get('child').initPromise.bind(this).then(function() {
            this.setupListeners();
        });
    },

    setupListeners: function() {

        this.get('child').on('change', this.onChildChange, this);

    },

    onChange: function(model, options) {
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
