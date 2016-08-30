var Object3D = require('../core/Object3D');

var CameraView = Object3D.Object3dView.extend({
    new_obj: function() {
        return new THREE.Camera();
    },

    needs_update: function() {
        this.obj.updateProjectionMatrix();
        this.options.render_frame();
    }
});

var CameraModel = Object3D.Object3dModel.extend({
    defaults: _.extend({}, Object3D.Object3dModel.prototype.defaults, {
        _view_name: 'CameraView',
        _model_name: 'CameraModel'
    })
});

module.exports = {
    CameraView: CameraView,
    CameraModel: CameraModel,
};
