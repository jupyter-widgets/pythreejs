var LightShadowAutogen = require('./LightShadow.autogen').LightShadowModel;

class LightShadowModel extends LightShadowAutogen {

    syncToThreeObj(force) {
        if (force || this.hasChanged('mapSize')) {
            // The map needs to be recreated!
            this.obj.map = null;
        }
        LightShadowAutogen.prototype.syncToThreeObj.apply(this, arguments);
    }

}

module.exports = {
    LightShadowModel: LightShadowModel,
};
