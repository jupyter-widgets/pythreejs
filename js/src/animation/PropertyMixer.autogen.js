//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:37 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var PropertyMixerModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'PropertyMixerView',
        _model_name: 'PropertyMixerModel',


    }),

    constructThreeObject: function() {

        return new THREE.PropertyMixer();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);

    },

});

var PropertyMixerView = ThreeView.extend({});

module.exports = {
    PropertyMixerView: PropertyMixerView,
    PropertyMixerModel: PropertyMixerModel,
};
