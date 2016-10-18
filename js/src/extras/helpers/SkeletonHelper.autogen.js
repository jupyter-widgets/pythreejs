//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var SkeletonHelperModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'SkeletonHelperView',
        _model_name: 'SkeletonHelperModel',


    }),

    constructThreeObject: function() {

        return new THREE.SkeletonHelper();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);

    },

});

var SkeletonHelperView = ThreeView.extend({});

module.exports = {
    SkeletonHelperView: SkeletonHelperView,
    SkeletonHelperModel: SkeletonHelperModel,
};
