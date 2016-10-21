//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var AxisHelperModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'AxisHelperView',
        _model_name: 'AxisHelperModel',


    }),

    constructThreeObject: function() {

        return new THREE.AxisHelper();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var AxisHelperView = ThreeView.extend({});

module.exports = {
    AxisHelperView: AxisHelperView,
    AxisHelperModel: AxisHelperModel,
};
