//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ShaderMaterialModel = require('./ShaderMaterial').ShaderMaterialModel;
var ShaderMaterialView = require('./ShaderMaterial').ShaderMaterialView;


var RawShaderMaterialModel = ShaderMaterialModel.extend({

    defaults: _.extend({}, ShaderMaterialModel.prototype.defaults, {

        _view_name: 'RawShaderMaterialView',
        _model_name: 'RawShaderMaterialModel',


    }),

    constructThreeObject: function() {

        return new THREE.RawShaderMaterial(
            {
            }
        );

    },

    createPropertiesArrays: function() {

        ShaderMaterialModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;


    },

});

var RawShaderMaterialView = ShaderMaterialView.extend({});

module.exports = {
    RawShaderMaterialView: RawShaderMaterialView,
    RawShaderMaterialModel: RawShaderMaterialModel,
};
