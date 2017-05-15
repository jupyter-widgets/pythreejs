//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');
var Promise = require('bluebird');

var RendererPool = require('../_base/RendererPool');

var WebGLRendererModel = widgets.DOMWidgetModel.extend({

    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
        _view_name: 'WebGLRendererView',
        _model_name: 'WebGLRendererModel',

        width: 200,
        height: 200,
        autoClear: true,
        autoClearColor: true,
        clearColor: '#000000',
        clearOpacity: 1.0,
        autoClearDepth: true,
        autoClearStencil: true,
        sortObject: true,
        clippingPlanes: null,
        localClippingEnabled: false,
        gammaFactor: 2.0,
        gammaInput: false,
        gammaOutput: false,
        physicallyCorrectLights: false,
        toneMappingExposure: 1.0,
        toneMappingWhitePoint: 1.0,
        maxMorphTargets: 8,
        maxMorphNormals: 4,
        toneMapping: 'LinearToneMapping',

    }),

}, {
    serializers: _.extend({
        clippingPlanes: { deserialize: widgets.unpack_models },
    }, widgets.DOMWidgetModel.serializers)
});


var WebGLRendererView = widgets.DOMWidgetView.extend({

    //
    // Backbone methods
    //

    initialize: function(attributes, options) {
        console.log('WebGLRenderer.initialize');

        widgets.DOMWidgetModel.prototype.initialize.apply(this, arguments);

        this.id = Math.floor(Math.random() * 1000000);
        this.isFrozen = true;

        this.listenTo(this.model, 'change',            this.onChange.bind(this));
        this.listenTo(this.model, 'change:width',      this.invoke('setSize', ['width', 'height']));
        this.listenTo(this.model, 'change:height',     this.invoke('setSize', ['width', 'height']));
        this.listenTo(this.model, 'change:clearColor', this.invoke('setClearColor', ['clearColor', 'clearAlpha']));
        this.listenTo(this.model, 'change:clearAlpha', this.invoke('setClearColor', ['clearColor', 'clearAlpha']));
        this.listenTo(this.model, 'msg:custom',        this.onCustomMessage.bind(this));
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
        this.acquireRenderer();

        this.el.className = "jupyter-widget jupyter-threejs";
        this.$el.empty().append(this.renderer.domElement);
    },

    //
    // WebGL Context Management methods
    //

    acquireRenderer: function() {
        if (!this.isFrozen) {
            return;
        }

        this.log('WebGLRenderer.acquiring...');

        if(this.$frozenRenderer) {
            this.$frozenRenderer.off('mouseenter');
            this.$frozenRenderer = null;
        }

        this.renderer = RendererPool.acquire(this.onRendererReclaimed.bind(this));
        this.renderer.setSize(this.model.get('width'), this.model.get('height'));

        this.$renderer = $(this.renderer.domElement);
        this.$el.empty().append(this.$renderer);

        // canvas elements have mysterious 5px bottom margin
        this.$el.css('margin-bottom', '-5px');

        this.log('WebGLRenderer.acquireRenderer(' + this.renderer.poolId + ')');

        this.isFrozen = false;
    },

    freeze: function() {
        if (this.isFrozen) {
            this.log('already frozen...');
            return;
        }

        this.log('WebGLRenderer.freeze(id=' + this.renderer.poolId + ')');

        this.$el.empty().append('<img src="' + this.renderer.domElement.toDataURL() + '" />');

        this.teardownViewer();
        this.isFrozen = true;

        this.$frozenRenderer = this.$el.find('img');
    },

    teardownViewer: function() {
        this.$renderer = null;
        this.renderer = null;
        // remove bottom margin correction
        this.$el.css('margin-bottom', 'auto');
        this.isFrozen = true;
    },

    //
    // Other methods
    //

    renderScene: function(scene, camera) {
        this.log("WebGLRenderer.renderScene");
        if (this.isFrozen) {
            this.acquireRenderer();
        }
        this.renderer.render(scene, camera);
    },

    invoke: function(methodName, propNames) {
        var fn = function() {
            args = propNames.map(function(name) {
                return this.model.get(name);
            }, this);
            this.renderer[methodName].apply(this.renderer, args);
        };
        return fn.bind(this);
    },

    objFromCommWidgetId: function(commWidgetId) {
        commWidgetId = commWidgetId.replace('IPY_MODEL_', '');
        var modelPromise = this.model.widget_manager.get_model(commWidgetId);
        return modelPromise.then(function(model) {
            return model.obj;
        });
    },

    log: function(str) {
        console.log('WGLR(' + this.id + '): ' + str);
    },

    //
    // Handlers
    //

    onChange: function() {
        this.log('WebGLRenderer:change');
    },

    onCustomMessage: function(content, buffers) {
        switch(content.type) {

            case 'render':
                Promise.props({
                    scene: this.objFromCommWidgetId(content.scene),
                    camera: this.objFromCommWidgetId(content.camera),
                }).bind(this).then(function(result) {
                    this.renderScene(result.scene, result.camera);
                });
                break;

            case 'freeze':
                this.freeze();

            default:
                throw new Error('Invalid custom msg type: ' + type);

        }
    },

    onRendererReclaimed: function() {
        this.log('WebGLRenderer WebGL context is being reclaimed: ' + this.renderer.poolId);
        this.freeze();
    },

});


module.exports = {
    WebGLRendererView: WebGLRendererView,
    WebGLRendererModel: WebGLRendererModel,
};
