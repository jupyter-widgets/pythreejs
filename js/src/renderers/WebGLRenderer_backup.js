//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');
var Promise = require('bluebird');

var RendererPool = require('../_base/RendererPool');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var WebGLRendererModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {
        _view_name: 'WebGLRendererView',
        _model_name: 'WebGLRendererModel',

        width: 640,
        height: 480,
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
        // TODO:
        // toneMapping: 'LinearToneMapping',

    }),

}, {
    serializers: _.extend({
        clippingPlanes: { deserialize: widgets.unpack_models },
    }, widgets.DOMWidgetModel.serializers)
});


var WebGLRendererView = ThreeView.extend({

    //
    // Backbone methods
    //

    initialize: function(attributes, options) {
        console.log('WebGLRenderer.initialize');

        ThreeView.prototype.initialize.apply(this, arguments);

        // TODO: Link width/_width and height/_height

        this.listenTo(this.model, 'change',            this.onChange.bind(this));
        this.listenTo(this.model, 'change:clearColor', this.invoke('setClearColor', ['clearColor', 'clearAlpha']));
        this.listenTo(this.model, 'change:clearAlpha', this.invoke('setClearColor', ['clearColor', 'clearAlpha']));
        this.listenTo(this.model, 'msg:custom',        this.onCustomMessage.bind(this));
    },

    //
    // Other methods
    //

    lazyRendererSetup: function() {
        if (this.camera === null || this.scene === null) {
            throw new Error('Camera and scene must be set!');
        }
        this.renderScene();
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

});


module.exports = {
    WebGLRendererView: WebGLRendererView,
    WebGLRendererModel: WebGLRendererModel,
};
