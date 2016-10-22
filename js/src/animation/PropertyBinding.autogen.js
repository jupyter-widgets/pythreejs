//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var PropertyBindingModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'PropertyBindingView',
        _model_name: 'PropertyBindingModel',


    }),

    constructThreeObject: function() {

        return new THREE.PropertyBinding();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var PropertyBindingView = ThreeView.extend({});

module.exports = {
    PropertyBindingView: PropertyBindingView,
    PropertyBindingModel: PropertyBindingModel,
};
