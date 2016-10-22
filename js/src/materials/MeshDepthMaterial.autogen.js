//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['morphTargets'] = null;
        this.property_converters['wireframe'] = null;
        this.property_converters['wireframeLinewidth'] = null;

    },

});

var MeshDepthMaterialView = MaterialView.extend({});

module.exports = {
    MeshDepthMaterialView: MeshDepthMaterialView,
    MeshDepthMaterialModel: MeshDepthMaterialModel,
};
