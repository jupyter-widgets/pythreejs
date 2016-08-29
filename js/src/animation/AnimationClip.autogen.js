//
// This file auto-generated with generate-wrappers.js
// Date: Mon Aug 29 2016 12:33:56 GMT-0700 (PDT)
//

var THREE = require('three');
var Animation = require('../base/Animation');

var AnimationClipModel = Animation.ThreeModel.extend({
    defaults: _.extend({}, Animation.ThreeModel.prototype.defaults, {
        _view_name: 'AnimationClipView'
        _model_name: 'AnimationClipModel'
    }),
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
