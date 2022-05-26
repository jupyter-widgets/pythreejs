var OrthographicCameraAutogen = require('./OrthographicCamera.autogen');

class OrthographicCameraModel extends OrthographicCameraAutogen.OrthographicCameraModel {
    // push data from model to three object
    syncToThreeObj() {
        OrthographicCameraAutogen.OrthographicCameraModel.prototype.syncToThreeObj.apply(this, arguments);
        // Always update the projection matrix after setting the attributes:
        this.obj.updateProjectionMatrix();
    }
}

module.exports = {
    OrthographicCameraModel: OrthographicCameraModel,
};
