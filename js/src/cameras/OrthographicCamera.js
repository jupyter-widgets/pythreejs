var _ = require('underscore');
var OrthographicCameraAutogen = require('./OrthographicCamera.autogen');

var OrthographicCameraModel = OrthographicCameraAutogen.OrthographicCameraModel.extend({
    // push data from model to three object
    syncToThreeObj: function() {
        OrthographicCameraAutogen.OrthographicCameraModel.prototype.syncToThreeObj.apply(this, arguments);
        // Always update the projection matrix after setting the attributes:
        this.obj.updateProjectionMatrix();
    }
});

module.exports = {
    OrthographicCameraModel: OrthographicCameraModel,
};
