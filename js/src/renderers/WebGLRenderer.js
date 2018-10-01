//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var Promise = require('bluebird');

var RenderableModel = require('../_base/Renderable').RenderableModel;
var RenderableView = require('../_base/Renderable').RenderableView;
var unpackThreeModel = require('../_base/serializers').unpackThreeModel;


var WebGLRendererModel = RenderableModel.extend({

    defaults: _.extend({}, RenderableModel.prototype.defaults, {
        _view_name: 'WebGLRendererView',
        _model_name: 'WebGLRendererModel',

        width: 200,
        height: 200,

    }),

}, {
    serializers: _.extend({
        clippingPlanes: { deserialize: unpackThreeModel },
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
        var modelPromise = unpackThreeModel(
            commWidgetId, this.model.widget_manager);
        return modelPromise.then(function(model) {
            return model.obj;
        });
    },

    log: function(str) {
        console.log('WGLR(' + this.id + '): ' + str);
    },

    acquireRenderer: function() {
        RenderableView.prototype.acquireRenderer.call(this);

        // We need to ensure that renderer properties are applied
        // (we have no idea where the renderer has been...)
        this.updateProperties();
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
