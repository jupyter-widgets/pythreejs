//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var PointLightHelperModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'PointLightHelperView',
        _model_name: 'PointLightHelperModel',


    }),

    constructThreeObject: function() {

        return new THREE.PointLightHelper();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var PointLightHelperView = ThreeView.extend({});

module.exports = {
    PointLightHelperView: PointLightHelperView,
    PointLightHelperModel: PointLightHelperModel,
};
