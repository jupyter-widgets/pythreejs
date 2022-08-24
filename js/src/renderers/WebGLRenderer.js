//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var Promise = require('bluebird');

var RenderableModel = require('../_base/Renderable').RenderableModel;
var RenderableView = require('../_base/Renderable').RenderableView;
var unpackThreeModel = require('../_base/serializers').unpackThreeModel;


class WebGLRendererModel extends RenderableModel {

    defaults() {
        return _.extend({}, RenderableModel.prototype.defaults, {
            _view_name: 'WebGLRendererView',
            _model_name: 'WebGLRendererModel',

            width: 200,
            height: 200,

        });
    }

}

WebGLRendererModel.serializers = {
    ...RenderableModel.serializers,
    clippingPlanes: { deserialize: unpackThreeModel },
};


class WebGLRendererView extends RenderableView {

    //
    // Backbone methods
    //

    lazyRendererSetup() {
        // Only do setup when widget is being shown
        // i.e. everything except renderScene
    }

    objFromCommWidgetId(commWidgetId) {
        var modelPromise = unpackThreeModel(
            commWidgetId, this.model.widget_manager);
        return modelPromise.then(function(model) {
            return model.obj;
        });
    }

    log(str) {
        console.log('WGLR(' + this.id + '): ' + str);
    }

    //
    // Handlers
    //

    onCustomMessage(content, buffers) {
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
    }

}


module.exports = {
    WebGLRendererView: WebGLRendererView,
    WebGLRendererModel: WebGLRendererModel,
};
