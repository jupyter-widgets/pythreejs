//
// This file auto-generated with generate-wrappers.js
// Date: Mon Aug 29 2016 13:14:43 GMT-0700 (PDT)
//

var THREE = require('three');
var Animation = require('../base/Animation');

var AnimationClipModel = Animation.ThreeModel.extend({
    defaults: _.extend({}, Animation.ThreeModel.prototype.defaults, {
        _view_name: 'AnimationClipView'
        _model_name: 'AnimationClipModel'

        name: "TestAnimation",
        noDefault: undefined,
        speed: 20,
        duration: 100,
    }),
}, {
    serializers: _.extend({
        noDefault: { deserialize: widgets.unpack_models },
    }, Animation.ThreeModel.serializers)
});

var AnimationClipView = Animation.ThreeView.extend({
    new_obj: function() {
        return new THREE.AnimationClip(
            this.model.get('speed'),
            this.model.get('duration')
        );
    },
})

module.exports = {
    AnimationClipView: AnimationClipView,
    AnimationClipModel: AnimationClipModel,
};
