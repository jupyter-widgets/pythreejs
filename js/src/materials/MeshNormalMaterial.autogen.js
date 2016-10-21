//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['wireframe'] = null;
        this.property_converters['wireframeLinewidth'] = null;
        this.property_converters['morphTargets'] = null;

    },

});

var MeshNormalMaterialView = MaterialView.extend({});

module.exports = {
    MeshNormalMaterialView: MeshNormalMaterialView,
    MeshNormalMaterialModel: MeshNormalMaterialModel,
};
