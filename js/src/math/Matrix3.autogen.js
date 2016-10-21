//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Matrix3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Matrix3View',
        _model_name: 'Matrix3Model',

        elements: [],

    }),

    constructThreeObject: function() {

        return new THREE.Matrix3();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['elements'] = null;

    },

});

var Matrix3View = ThreeView.extend({});

module.exports = {
    Matrix3View: Matrix3View,
    Matrix3Model: Matrix3Model,
};
