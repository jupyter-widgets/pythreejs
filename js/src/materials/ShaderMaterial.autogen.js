//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;


var ShaderMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'ShaderMaterialView',
        _model_name: 'ShaderMaterialModel',

        uniforms: {},
        vertexShader: "",
        fragmentShader: "",

    }),

    constructThreeObject: function() {

        return new THREE.ShaderMaterial(
            {
                uniforms: this.get('uniforms'),
                vertexShader: this.get('vertexShader'),
                fragmentShader: this.get('fragmentShader'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.dict_properties.push('uniforms');
        this.scalar_properties.push('vertexShader');
        this.scalar_properties.push('fragmentShader');

    },

});

var ShaderMaterialView = MaterialView.extend({});

module.exports = {
    ShaderMaterialView: ShaderMaterialView,
    ShaderMaterialModel: ShaderMaterialModel,
};
