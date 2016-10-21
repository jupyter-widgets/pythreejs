//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var CubicBezierCurve3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'CubicBezierCurve3View',
        _model_name: 'CubicBezierCurve3Model',


    }),

    constructThreeObject: function() {

        return new THREE.CubicBezierCurve3();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var CubicBezierCurve3View = ThreeView.extend({});

module.exports = {
    CubicBezierCurve3View: CubicBezierCurve3View,
    CubicBezierCurve3Model: CubicBezierCurve3Model,
};
