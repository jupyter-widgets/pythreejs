//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var SplineCurve3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'SplineCurve3View',
        _model_name: 'SplineCurve3Model',


    }),

    constructThreeObject: function() {

        return new THREE.SplineCurve3();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);

    },

});

var SplineCurve3View = ThreeView.extend({});

module.exports = {
    SplineCurve3View: SplineCurve3View,
    SplineCurve3Model: SplineCurve3Model,
};
