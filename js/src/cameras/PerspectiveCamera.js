var _ = require('underscore');
var PerspectiveCameraAutogen = require('./PerspectiveCamera.autogen');

var PerspectiveCameraModel = PerspectiveCameraAutogen.PerspectiveCameraModel.extend({
    // push data from model to three object
    syncToThreeObj: function() {
        PerspectiveCameraAutogen.PerspectiveCameraModel.prototype.syncToThreeObj.apply(this, arguments);
        // Always update the projection matrix after setting the attributes:
        this.obj.updateProjectionMatrix();
    }
});

module.exports = {
    PerspectiveCameraModel: PerspectiveCameraModel,
};
