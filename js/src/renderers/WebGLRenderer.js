//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');
var Promise = require('bluebird');

var RenderableModel = require('../_base/Renderable').RenderableModel;
var RenderableView = require('../_base/Renderable').RenderableView;

var WebGLRendererModel = RenderableModel.extend({

    defaults: _.extend({}, RenderableModel.prototype.defaults, {
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
    }, RenderableModel.serializers)
});


var WebGLRendererView = RenderableView.extend({

    //
    // Backbone methods
    //

    lazyRendererSetup: function() {
        // Only do setup when widget is being shown
        // i.e. everything except renderScene
    },

    objFromCommWidgetId: function(commWidgetId) {
        var modelPromise = widgets.unpack_models(
            commWidgetId, this.model.widget_manager)
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

            default:
                return RenderableView.prototype.onCustomMessage.apply(this, arguments);

        }
    },

});


module.exports = {
    WebGLRendererView: WebGLRendererView,
    WebGLRendererModel: WebGLRendererModel,
};
