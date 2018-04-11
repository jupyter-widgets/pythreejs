var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');

var THREE = require('three');

var Renderable = require('./Renderable');
var RenderableView = Renderable.RenderableView;
var RenderableModel = Renderable.RenderableModel;
var OrbitControls = require('../examples/controls/OrbitControls.js').OrbitControls;
var utils = require('./utils.js');


var BLACK = new THREE.Color('black');


var PreviewView = RenderableView.extend({

    initialize: function() {
        RenderableView.prototype.initialize.apply(this, arguments);

        this._resetCameraNeeded = true;
        this._rebuildNeeded = true;

    },

    render: function() {
        // ensure that model is fully initialized before attempting render
        return this.model.initPromise.bind(this).then(this.doRender);
    },


    setupEventListeners: function() {
        RenderableView.prototype.setupEventListeners.call(this);
        var child = this.model.get('child');
        this.listenTo(child, 'change', this.onChildChanged.bind(this));
        if (child.obj.isObject3D) {
            // Since we use clone for objects, we need to rebuild for
            // any nested change instead of just rerendering.
            this.listenTo(child, 'childchange', this.onChildChanged.bind(this));
        }
    },

    onChildChanged: function() {
        // Enabling this line will reset the camera
        // when any changes are made to the child
        //this._resetCameraNeeded = true;

        this._rebuildNeeded = true;
    },

    constructScene: function() {

        var obj = this.model.get('child').obj;

        this.clearScene();

        var geometry, mesh;

        if (obj.isObject3D) {

            this.debug('render Object3D');
            // Use a clone to not change `parent` attribute
            this.scene.add(obj.clone());

        } else if (obj.isGeometry || obj.isBufferGeometry) {

            var material;
            if (this.model.get('_flat')) {
                material = new THREE.MeshPhongMaterial({
                    color: '#ffffff',
                    flatShading: true,
                });
            } else if (this.model.get('_wire') || obj.type === 'WireframeGeometry') {
                material = new THREE.MeshBasicMaterial({
                    color: '#888888',
                    wireframe: true,
                    flatShading: true,
                });
            } else {
                material = new THREE.MeshLambertMaterial({
                    color: '#ffffff',
                });
            }
            if (obj.isBufferGeometry && 'color' in obj.attributes) {
                material.vertexColors = THREE.VertexColors;
            }

            mesh = new THREE.Mesh(obj, material);
            this.scene.add(mesh);

        } else if (obj.isMaterial) {

            if (obj.type === 'SpriteMaterial') {
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
                geometry = new THREE.SphereGeometry(15, 16, 12);
                mesh = new THREE.Mesh(geometry, obj);
                this.scene.add(mesh);
            }

        } else if (obj.isTexture) {

            geometry = new THREE.SphereGeometry(15, 16, 12);
            var mat = new THREE.MeshStandardMaterial({ map: obj });
            mesh = new THREE.Mesh(geometry, mat);
            this.scene.add(mesh);

        } else {

            console.log('Unexpected object in preview, scene will be empty:', obj);

        }

        // Reset camera initially and on later requests
        if (this._resetCameraNeeded) {
            this.resetCamera();  // Depends on this.scene to be correctly set up
            this._resetCameraNeeded = false;
        }

        // Cameras need to be added to scene
        this.scene.add(this.camera);

        // Clear at end to ensure that any changes to obj does not
        // cause infinite rebuild chain.
        this._rebuildNeeded = false;
    },

    resetCamera: function() {
        // Compute bounding sphere for entire scene
        var sphere = utils.computeBoundingSphere(this.scene);
        if (sphere === null) {
            sphere = new THREE.Sphere(new THREE.Vector3(), 1);
        }

        // Update camera to include bounding sphere
        utils.lookAtSphere(this.camera, sphere.center, sphere.radius);

        // Update controls with new target
        var control = this.controls[0];
        control.target.copy(sphere.center);
        control.target0.copy(sphere.center);
        control.update();

        // Position light up to the left and behind camera
        var dist = 2.5 * (this.camera.position.z - sphere.center.z);
        this.pointLight.position.set(-dist, dist, dist);
    },

    clearScene: function() {
        // this.controls.reset();
        this.scene.remove.apply(this.scene, this.scene.children.slice());
    },

    setupControls: function() {
        // Allow user to inspect object with mouse/scrollwheel
        this.debug('setting up controls');
        var control = new OrbitControls(this.camera, this.renderer.domElement);
        control.target.set(0, 0, 0);
        control.update();
        this.controls = [control];
    },

    lazyRendererSetup: function() {
        this.camera = new THREE.PerspectiveCamera(60, 1.0);
        // aspect is updated by this.updateSize()
        // position and lookat target is updated to fit scene
        // by this.resetCamera() via constructScene()

        // Update aspect ratio of camera:
        this.updateSize();

        this.scene = new THREE.Scene();

        // Overrides clear color of renderer:
        this.scene.background = BLACK;

        // Lights
        this.pointLight = new THREE.PointLight('#ffffff', 0.5, 0, 0);
        this.ambLight = new THREE.AmbientLight('#ffffff', 0.5);
        this.camera.add(this.ambLight);
        this.camera.add(this.pointLight);

        this.setupControls();
        this.enableControls();

        this.renderScene();
    },

    renderScene: function() {
        this.debug('renderScene');

        if (this.isFrozen) {
            this.unfreeze();
        }

        if (this.renderer.context.isContextLost()) {
            // Context is invalid, freeze for now (stops animation etc)
            this.freeze();
            return;
        }

        if (this._rebuildNeeded) {
            this.constructScene();
        }

        if (this.scene.ipymodel) {
            this.scene.ipymodel.trigger('beforeRender', this.scene, this.renderer, this.camera);
        }
        this.renderer.render(this.scene, this.camera);
        if (this.scene.ipymodel) {
            this.scene.ipymodel.trigger('afterRender', this.scene, this.renderer, this.camera);
        }
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
        this.listenTo(child, 'change', this.onChildChanged.bind(this));
        this.listenTo(child, 'childchange', this.onChildChanged.bind(this));
    },

    onChildChanged: function(model, options) {
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
