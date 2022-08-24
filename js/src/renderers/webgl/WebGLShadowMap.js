
var Promise = require('bluebird');

var WebGLShadowMapAutogenModel = require('./WebGLShadowMap.autogen').WebGLShadowMapModel;


/**
 * Renderer child classes are different, as they map to 0 or more THREE objects,
 * depending on how many views there are. Much of the sync logic is therefore
 * put in the `Renderable` class instead.
 */
class WebGLShadowMapModel extends WebGLShadowMapAutogenModel {

    constructThreeObject() {
        // This should never be instantiated directly
        return Promise.resolve(null);
    }

    processNewObj() {
        // Leave this to Renderable
    }

    syncToThreeObj(force) {
        // Leave this to Renderable
    }

    syncToModel(syncAllProps) {
        // Leave this to Renderable
    }

}

module.exports = {
    WebGLShadowMapModel: WebGLShadowMapModel,
};
