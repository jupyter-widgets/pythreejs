//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;


var MeshNormalMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'MeshNormalMaterialView',
        _model_name: 'MeshNormalMaterialModel',

        wireframe: false,
        wireframeLinewidth: 1,
        morphTargets: false,

    }),

    constructThreeObject: function() {

        return new THREE.MeshNormalMaterial(
            {
                wireframe: this.get('wireframe'),
                wireframeLinewidth: this.get('wireframeLinewidth'),
                morphTargets: this.get('morphTargets'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('wireframe');
        this.scalar_properties.push('wireframeLinewidth');
        this.scalar_properties.push('morphTargets');

    },

});

var MeshNormalMaterialView = MaterialView.extend({});

module.exports = {
    MeshNormalMaterialView: MeshNormalMaterialView,
    MeshNormalMaterialModel: MeshNormalMaterialModel,
};
