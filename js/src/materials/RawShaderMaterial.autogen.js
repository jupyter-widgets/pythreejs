//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
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

    },

});

var RawShaderMaterialView = ShaderMaterialView.extend({});

module.exports = {
    RawShaderMaterialView: RawShaderMaterialView,
    RawShaderMaterialModel: RawShaderMaterialModel,
};
