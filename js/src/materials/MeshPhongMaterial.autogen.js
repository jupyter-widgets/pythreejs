//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;

var TextureModel = require('../textures/Texture').TextureModel;
var TextureView = require('../textures/Texture').TextureView;

var MeshPhongMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'MeshPhongMaterialView',
        _model_name: 'MeshPhongMaterialModel',

        color: "#ffffff",
        specular: "#111111",
        shininess: 30,
        map: null,
        lightMap: null,
        lightMapIntensity: 1,
        aoMap: null,
        aoMapIntensity: 1,
        emissive: "#000000",
        emissiveMap: null,
        emissiveIntensity: 1,
        bumpMap: null,
        bumpScale: 1,
        normalMap: null,
        normalScale: [1,1],
        displacementMap: null,
        displacementScale: 1,
        displacementBias: 0,
        specularMap: null,
        alphaMap: null,
        envMap: null,
        combine: "MultiplyOperation",
        reflectivity: 1,
        refractionRatio: 0.98,
        fog: false,
        shading: "SmoothShading",
        wireframe: false,
        wireframeLinewidth: 1,
        wireframeLinecap: "round",
        wireframeLinejoin: "round",
        vertexColors: "NoColors",
        skinning: false,
        morphTargets: false,
        morphNormals: false,

    }),

    constructThreeObject: function() {

        return new THREE.MeshPhongMaterial(
            {
                color: this.get('color'),
                specular: this.get('specular'),
                shininess: this.get('shininess'),
                map: this.get('map'),
                lightMap: this.get('lightMap'),
                lightMapIntensity: this.get('lightMapIntensity'),
                aoMap: this.get('aoMap'),
                aoMapIntensity: this.get('aoMapIntensity'),
                emissive: this.get('emissive'),
                emissiveMap: this.get('emissiveMap'),
                emissiveIntensity: this.get('emissiveIntensity'),
                bumpMap: this.get('bumpMap'),
                bumpScale: this.get('bumpScale'),
                normalMap: this.get('normalMap'),
                normalScale: this.convertVectorModelToThree(this.get('normalScale')),
                displacementMap: this.get('displacementMap'),
                displacementScale: this.get('displacementScale'),
                displacementBias: this.get('displacementBias'),
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
                morphNormals: this.get('morphNormals'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('color');
        this.color_properties.push('specular');
        this.scalar_properties.push('shininess');
        this.three_properties.push('map');
        this.three_properties.push('lightMap');
        this.scalar_properties.push('lightMapIntensity');
        this.three_properties.push('aoMap');
        this.scalar_properties.push('aoMapIntensity');
        this.color_properties.push('emissive');
        this.three_properties.push('emissiveMap');
        this.scalar_properties.push('emissiveIntensity');
        this.three_properties.push('bumpMap');
        this.scalar_properties.push('bumpScale');
        this.three_properties.push('normalMap');
        this.vector_properties.push('normalScale');
        this.three_properties.push('displacementMap');
        this.scalar_properties.push('displacementScale');
        this.scalar_properties.push('displacementBias');
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
        this.scalar_properties.push('morphNormals');
        this.enum_property_types['combine'] = 'Operations';
        this.enum_property_types['shading'] = 'Shading';
        this.enum_property_types['vertexColors'] = 'Colors';

    },

}, {

    serializers: _.extend({
        map: { deserialize: widgets.unpack_models },
        lightMap: { deserialize: widgets.unpack_models },
        aoMap: { deserialize: widgets.unpack_models },
        emissiveMap: { deserialize: widgets.unpack_models },
        bumpMap: { deserialize: widgets.unpack_models },
        normalMap: { deserialize: widgets.unpack_models },
        displacementMap: { deserialize: widgets.unpack_models },
        specularMap: { deserialize: widgets.unpack_models },
        alphaMap: { deserialize: widgets.unpack_models },
        envMap: { deserialize: widgets.unpack_models },
    }, MaterialModel.serializers),
    
});

var MeshPhongMaterialView = MaterialView.extend({});

module.exports = {
    MeshPhongMaterialView: MeshPhongMaterialView,
    MeshPhongMaterialModel: MeshPhongMaterialModel,
};
