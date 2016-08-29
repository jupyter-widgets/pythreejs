//
// This file auto-generated with generate-wrappers.js
// Date: Mon Aug 29 2016 15:04:31 GMT-0700 (PDT)
//

var THREE = require('three');
var ThreeModel = require('./Animation').ThreeModel;
var ThreeView = require('./Animation').ThreeView;

var Object3D = require('./../core/Object3D').Object3D;
var ThreeView = require('./../base').ThreeView;
var ThreeModel = require('./../base').ThreeModel;

var AnimationClipModel = ThreeModel.extend({
    defaults: _.extend({}, ThreeModel.prototype.defaults, {
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
    }, ThreeModel.serializers)
});

var AnimationClipView = ThreeView.extend({
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
