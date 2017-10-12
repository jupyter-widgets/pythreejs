//
// This file auto-generated with generate-wrappers.js
// Date: Wed May 10 2017 14:05:45 GMT+0200 (W. Europe Daylight Time)
//

var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');

var RenderableModel = require('../_base/Renderable').RenderableModel;
var RenderableView = require('../_base/Renderable').RenderableView;
var ThreeModel = require('../_base/Three').ThreeModel;

var RendererModel = RenderableModel.extend({

    defaults: _.extend({}, RenderableModel.prototype.defaults, {

        _view_name: 'RendererView',
        _model_name: 'RendererModel',

        scene: null,
        camera: null,
        controls: [],
        effect: null,
        background: "black",
        background_opacity: 1.0,

    }),

    initialize: function(attributes, options) {
        RenderableModel.prototype.initialize.apply(this, arguments);

        this.initPromise = this.get('scene').initPromise.bind(this).then(function() {
            this.setupListeners();
        });
    },

    setupListeners: function() {

        var scene = this.get('scene');
        var camera = this.get('camera');
        this.listenTo(scene, 'change', this.onChildChange.bind(this));
        this.listenTo(scene, 'childchange', this.onChildChange.bind(this));
        this.listenTo(scene, 'rerender', this.onChildChange.bind(this));
        this.listenTo(camera, 'change', this.onCameraChange.bind(this));

    },

    onCameraChange: function(model, options) {
        this.onChildChange();
    },

    onChildChange: function(model, options) {
        this.trigger('rerender', this, {});
    },

}, {

    serializers: _.extend({
        scene: { deserialize: widgets.unpack_models },
        camera: { deserialize: widgets.unpack_models },
        controls: { deserialize: widgets.unpack_models },
        effect: { deserialize: widgets.unpack_models },
    }, RenderableModel.serializers),

});

var RendererView = RenderableView.extend({

    render: function() {
        // ensure that model is fully initialized before attempting render
        return this.model.initPromise.bind(this).then(this.doRender);
    },

    lazyRendererSetup: function() {
        this.scene = this.model.get('scene').obj;
        this.camera = this.model.get('camera').obj;
        controls = [];
        this.model.get('controls').forEach(function (controlModel) {
            controls.push(controlModel.obj);
        });
        this.controls = controls;
        if (this.controls) {
            this.enableControls();
        }
        this.renderScene();
    },

    setupEventListeners: function() {
        RenderableView.prototype.setupEventListeners.call(this);

        this.listenTo(this.model, 'change:camera', this.onCameraSwitched.bind(this));
        this.listenTo(this.model, 'change:scene', this.onSceneSwitched.bind(this));
        this.listenTo(this.model, 'change:controls', this.onControlsSwitched.bind(this));
        this.listenTo(this.model, 'change:background change:background_opacity', this.applyBackground.bind(this));
    },

    onCameraSwitched: function() {
        this.camera = this.model.get('camera').obj;
    },

    onSceneSwitched: function() {
        this.scene = this.model.get('scene').obj;
    },

    onControlsSwitched: function() {
        if (!this.isFrozen) {
            this.disableControls();
        }

        controls = [];
        this.model.get('controls').forEach(function (controlModel) {
            controls.push(controlModel.obj);
        });

        if (!this.isFrozen) {
            this.enableControls();
        }
    },

    enableControls: function() {
        RenderableView.prototype.enableControls.apply(this, arguments);
        this.model.get('controls').forEach(function (controlModel) {
            controlModel.trigger('enableControl', this);
        }, this);
    },

    disableControls: function() {
        RenderableView.prototype.disableControls.apply(this, arguments);
        this.model.get('controls').forEach(function (controlModel) {
            controlModel.trigger('disableControl', this);
        }, this);
    },

    applyBackground: function() {
        if (!this.isFrozen) {
            var background = ThreeModel.prototype.convertColorModelToThree(this.model.get('background'));
            var background_opacity = ThreeModel.prototype.convertFloatModelToThree(this.model.get('background_opacity'));
            this.renderer.setClearColor(background, background_opacity);
        }
    },

    update: function() {
        this.tick();
    },

    acquireRenderer: function() {
        RenderableView.prototype.acquireRenderer.call(this);

        // We need to ensure that renderer properties are applied
        // (we have no idea where the renderer has been...)
        this.applyBackground();
    },

});

module.exports = {
    RendererView: RendererView,
    RendererModel: RendererModel,
};
