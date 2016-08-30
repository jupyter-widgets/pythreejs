//
// This file auto-generated with generate-wrappers.js
// Date: Tue Aug 30 2016 08:15:29 GMT-0700 (PDT)
//

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

    new_properties: function() {
        ThreeView.prototype.new_properties.call(this);
        this.scalar_properties.push('name');
        this.child_properties.push('noDefault');
        this.scalar_properties.push('speed');
        this.scalar_properties.push('duration');
    },

})

module.exports = {
    AnimationClipView: AnimationClipView,
    AnimationClipModel: AnimationClipModel,
};
