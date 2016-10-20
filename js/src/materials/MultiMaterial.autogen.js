//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;

var MultiMaterialModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'MultiMaterialView',
        _model_name: 'MultiMaterialModel',

        materials: [],

    }),

    constructThreeObject: function() {

        return new THREE.MultiMaterial(
            {
                materials: this.get('materials'),
            }
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.three_array_properties.push('materials');

    },

}, {

    serializers: _.extend({
        materials: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var MultiMaterialView = ThreeView.extend({});

module.exports = {
    MultiMaterialView: MultiMaterialView,
    MultiMaterialModel: MultiMaterialModel,
};
