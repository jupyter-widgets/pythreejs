var THREE = require('three');
var Camera = require('./Camera');

var PerspectiveCameraView = Camera.CameraView.extend({
    new_properties: function() {
        Camera.CameraView.prototype.new_properties.call(this);
        this.scalar_properties.push('fov', 'aspect', 'near', 'far');
    },

    new_obj: function() {
        return new THREE.PerspectiveCamera(this.model.get('fov'),
            this.model.get('aspect'),
            this.model.get('near'),
            this.model.get('far'));
    }
});

var PerspectiveCameraModel = Camera.CameraModel.extend({
    defaults: _.extend({}, Camera.CameraModel.prototype.defaults, {
        _view_name: 'PerspectiveCameraView',
        _model_name: 'PerspectiveCameraModel',

        fov: 50.0,
        aspect: 1.5,  // 6.0 / 4.0
        near: 0.1,
        far: 2000.0
    })
});

module.exports = {
    PerspectiveCameraView: PerspectiveCameraView,
    PerspectiveCameraModel: PerspectiveCameraModel,
};
