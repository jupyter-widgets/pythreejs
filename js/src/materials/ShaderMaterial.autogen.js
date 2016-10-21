//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
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
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['uniforms'] = null;
        this.property_converters['vertexShader'] = null;
        this.property_converters['fragmentShader'] = null;

    },

});

var ShaderMaterialView = MaterialView.extend({});

module.exports = {
    ShaderMaterialView: ShaderMaterialView,
    ShaderMaterialModel: ShaderMaterialModel,
};
