var _ = require('underscore');
var LightShadowAutogen = require('./LightShadow.autogen').LightShadowModel;

var LightShadowModel = LightShadowAutogen.extend({

    syncToThreeObj: function(force) {
        if (force || this.hasChanged('mapSize')) {
            // The map needs to be recreated!
            this.obj.map = null;
        }
        LightShadowAutogen.prototype.syncToThreeObj.apply(this, arguments);
    }

});

module.exports = {
    LightShadowModel: LightShadowModel,
};
