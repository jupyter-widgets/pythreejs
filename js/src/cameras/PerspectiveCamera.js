var PerspectiveCameraAutogen = require('./PerspectiveCamera.autogen');

class PerspectiveCameraModel extends PerspectiveCameraAutogen.PerspectiveCameraModel {
    // push data from model to three object
    syncToThreeObj() {
        PerspectiveCameraAutogen.PerspectiveCameraModel.prototype.syncToThreeObj.apply(this, arguments);
        // Always update the projection matrix after setting the attributes:
        this.obj.updateProjectionMatrix();
    }
}

module.exports = {
    PerspectiveCameraModel: PerspectiveCameraModel,
};
