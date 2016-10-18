//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;

var TextureModel = require('../textures/Texture').TextureModel;
var TextureView = require('../textures/Texture').TextureView;

var MeshBasicMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'MeshBasicMaterialView',
        _model_name: 'MeshBasicMaterialModel',

        color: "#ffffff",
        map: null,
        aoMap: null,
        aoMapIntensity: 1,
        specularMap: null,
        alphaMap: null,
        envMap: null,
        combine: "MultiplyOperation",
        reflectivity: 1,
        refractionRatio: 0.98,
        fog: true,
        shading: "SmoothShading",
        wireframe: false,
        wireframeLinewidth: 1,
        wireframeLinecap: "round",
        wireframeLinejoin: "round",
        vertexColors: "NoColors",
        skinning: false,
        morphTargets: false,

    }),

    constructThreeObject: function() {

        return new THREE.MeshBasicMaterial(
            {
                color: this.get('color'),
                map: this.get('map'),
                aoMap: this.get('aoMap'),
                aoMapIntensity: this.get('aoMapIntensity'),
                specularMap: this.get('specularMap'),
                alphaMap: this.get('alphaMap'),
                envMap: this.get('envMap'),
                combine: this.get('combine'),
                reflectivity: this.get('reflectivity'),
                refractionRatio: this.get('refractionRatio'),
                fog: this.get('fog'),
                shading: this.get('shading'),
                wireframe: this.get('wireframe'),
                wireframeLinewidth: this.get('wireframeLinewidth'),
                wireframeLinecap: this.get('wireframeLinecap'),
                wireframeLinejoin: this.get('wireframeLinejoin'),
                vertexColors: this.get('vertexColors'),
                skinning: this.get('skinning'),
                morphTargets: this.get('morphTargets'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('color');
        this.three_properties.push('map');
        this.three_properties.push('aoMap');
        this.scalar_properties.push('aoMapIntensity');
        this.three_properties.push('specularMap');
        this.three_properties.push('alphaMap');
        this.three_properties.push('envMap');
        this.enum_properties.push('combine');
        this.scalar_properties.push('reflectivity');
        this.scalar_properties.push('refractionRatio');
        this.scalar_properties.push('fog');
        this.enum_properties.push('shading');
        this.scalar_properties.push('wireframe');
        this.scalar_properties.push('wireframeLinewidth');
        this.scalar_properties.push('wireframeLinecap');
        this.scalar_properties.push('wireframeLinejoin');
        this.enum_properties.push('vertexColors');
        this.scalar_properties.push('skinning');
        this.scalar_properties.push('morphTargets');
        this.enum_property_types['combine'] = 'Operations';
        this.enum_property_types['shading'] = 'Shading';
        this.enum_property_types['vertexColors'] = 'Colors';

    },

}, {

    serializers: _.extend({
        map: { deserialize: widgets.unpack_models },
        aoMap: { deserialize: widgets.unpack_models },
        specularMap: { deserialize: widgets.unpack_models },
        alphaMap: { deserialize: widgets.unpack_models },
        envMap: { deserialize: widgets.unpack_models },
    }, MaterialModel.serializers),
    
});

var MeshBasicMaterialView = MaterialView.extend({});

module.exports = {
    MeshBasicMaterialView: MeshBasicMaterialView,
    MeshBasicMaterialModel: MeshBasicMaterialModel,
};
