//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;


var MeshDepthMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'MeshDepthMaterialView',
        _model_name: 'MeshDepthMaterialModel',

        morphTargets: false,
        wireframe: false,
        wireframeLinewidth: 1,

    }),

    constructThreeObject: function() {

        return new THREE.MeshDepthMaterial(
            {
                morphTargets: this.get('morphTargets'),
                wireframe: this.get('wireframe'),
                wireframeLinewidth: this.get('wireframeLinewidth'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('morphTargets');
        this.scalar_properties.push('wireframe');
        this.scalar_properties.push('wireframeLinewidth');

    },

});

var MeshDepthMaterialView = MaterialView.extend({});

module.exports = {
    MeshDepthMaterialView: MeshDepthMaterialView,
    MeshDepthMaterialModel: MeshDepthMaterialModel,
};
