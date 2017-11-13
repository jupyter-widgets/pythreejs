
var _ = require('underscore');
var Promise = require('bluebird');

var WebGLShadowMapAutogenModel = require('./WebGLShadowMap.autogen').WebGLShadowMapModel;


/**
 * Renderer child classes are different, as they map to 0 or more THREE objects,
 * depending on how many views there are. Much of the sync logic is therefore
 * put in the `Renderable` class instead.
 */
var WebGLShadowMapModel = WebGLShadowMapAutogenModel.extend({

    constructThreeObject: function() {
        // This should never be instantiated directly
        return Promise.resolve(null);
    },

    processNewObj: function() {
        // Leave this to Renderable
    },

    syncToThreeObj: function(force) {
        // Leave this to Renderable
    },

    synToModel: function(syncAllProps) {
        // Leave this to Renderable
    },

});

module.exports = {
    WebGLShadowMapModel: WebGLShadowMapModel,
};
