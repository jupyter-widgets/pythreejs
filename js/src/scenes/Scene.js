var THREE = require('three');
var Object3D = require('../core/Object3D');

var SceneView = Object3D.Object3dView.extend({
    new_obj: function() {
        return new THREE.Scene();
    },

    needs_update: function() {
        this.options.render_frame();
    }
});

var SceneModel = Object3D.Object3dModel.extend({
    defaults: _.extend({}, Object3D.Object3dModel.prototype.defaults, {
        _view_name: 'SceneView',
        _model_name: 'SceneModel'
    })
});

module.exports = {
    SceneView: SceneView,
    SceneModel: SceneModel,
};
