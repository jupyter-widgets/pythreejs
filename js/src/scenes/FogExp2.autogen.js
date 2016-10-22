//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var FogExp2Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'FogExp2View',
        _model_name: 'FogExp2Model',


    }),

    constructThreeObject: function() {

        return new THREE.FogExp2();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var FogExp2View = ThreeView.extend({});

module.exports = {
    FogExp2View: FogExp2View,
    FogExp2Model: FogExp2Model,
};
