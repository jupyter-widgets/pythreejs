//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:50 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var AnimationClipModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'AnimationClipView',
        _model_name: 'AnimationClipModel',


    }),

    constructThreeObject: function() {

        return new THREE.AnimationClip();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var AnimationClipView = ThreeView.extend({});

module.exports = {
    AnimationClipView: AnimationClipView,
    AnimationClipModel: AnimationClipModel,
};
