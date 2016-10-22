//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var ArcCurveModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'ArcCurveView',
        _model_name: 'ArcCurveModel',


    }),

    constructThreeObject: function() {

        return new THREE.ArcCurve();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var ArcCurveView = ThreeView.extend({});

module.exports = {
    ArcCurveView: ArcCurveView,
    ArcCurveModel: ArcCurveModel,
};
