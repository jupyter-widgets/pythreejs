//
// This file auto-generated with generate-wrappers.js
// Date: Wed May 10 2017 14:05:45 GMT+0200 (W. Europe Daylight Time)
//

var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');

var RenderableModel = require('../_base/Renderable').RenderableModel;
var RenderableView = require('../_base/Renderable').RenderableView;


var RendererModel = RenderableModel.extend({

    defaults: _.extend({}, RenderableModel.prototype.defaults, {

        _view_name: 'RendererView',
        _model_name: 'RendererModel',

        width: "600",
        height: "400",
        scene: null,
        camera: null,
        controls: [],
        effect: null,
        background: "black",
        background_opacity: 0,

    }),

    initialize: function(attributes, options) {
        RenderableModel.prototype.initialize.apply(this, arguments);

        this.initPromise = this.get('scene').initPromise.bind(this).then(function() {
            this.setupListeners();
        });
    },

    setupListeners: function() {

        var scene = this.get('scene');
        this.listenTo(scene, 'change', this.onChange.bind(this));
        this.listenTo(scene, 'childchange', this.onChange.bind(this));

    },

    onChange: function(model, options) {
        this.trigger('rerender', this, {});
    },

}, {

    serializers: _.extend({
        scene: { deserialize: widgets.unpack_models },
        camera: { deserialize: widgets.unpack_models },
        controls: { deserialize: widgets.unpack_models },
        effect: { deserialize: widgets.unpack_models },
    }, widgets.DOMWidgetModel.serializers),

});

var RendererView = RenderableView.extend({

    lazyRendererSetup: function() {
        this.camera = this.model.get('camera').obj;
        this.scene = this.model.get('scene').obj;
        controls = [];
        this.model.get('controls').forEach(function (controlModel) {
            controls.push(controlModel.obj);
        });
        this.controls = controls;
        this.enableControls();
        //this.effect = this.model.get('effect').obj;
        this.updateSize();
        this.renderScene();
    },

});

module.exports = {
    RendererView: RendererView,
    RendererModel: RendererModel,
};
