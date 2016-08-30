var Camera = require('./Camera');

var OrthographicCameraView = Camera.CameraView.extend({
    new_properties: function() {
        Camera.CameraView.prototype.new_properties.call(this);
        this.scalar_properties.push('left', 'right', 'top', 'bottom', 'near', 'far');
    },

    new_obj: function() {
        return new THREE.OrthographicCamera(this.model.get('left'),
            this.model.get('right'),
            this.model.get('top'),
            this.model.get('bottom'),
            this.model.get('near'),
            this.model.get('far'));
    }
});


var OrthographicCameraModel = Camera.CameraModel.extend({
    defaults: _.extend({}, Camera.CameraModel.prototype.defaults, {
        _view_name: 'OrthographicCameraView',
        _model_name: 'OrthographicCameraModel',

        left: -10.0,
        right: 10.0,
        top: -10.0,
        bottom: 10.0,
        near: 0.1,
        far: 2000.0
    })
});

module.exports = {
    OrthographicCameraView: OrthographicCameraView,
    OrthographicCameraModel: OrthographicCameraModel,
};
