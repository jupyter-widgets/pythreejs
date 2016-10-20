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

var MeshStandardMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'MeshStandardMaterialView',
        _model_name: 'MeshStandardMaterialModel',

        color: "#ffffff",
        roughness: 0.5,
        metalness: 0.5,
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
        displacementMap: null,
        displacementScale: 1,
        displacementBias: 0,
        roughnessMap: null,
        metalnessMap: null,
        alphaMap: null,
        envMap: null,
        envMapIntensity: 1,
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
        morphNormals: false,

    }),

    constructThreeObject: function() {

        return new THREE.MeshStandardMaterial(
            {
                color: this.get('color'),
                roughness: this.get('roughness'),
                metalness: this.get('metalness'),
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
                displacementMap: this.get('displacementMap'),
                displacementScale: this.get('displacementScale'),
                displacementBias: this.get('displacementBias'),
                roughnessMap: this.get('roughnessMap'),
                metalnessMap: this.get('metalnessMap'),
                alphaMap: this.get('alphaMap'),
                envMap: this.get('envMap'),
                envMapIntensity: this.get('envMapIntensity'),
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
        this.color_properties.push('color');
        this.scalar_properties.push('roughness');
        this.scalar_properties.push('metalness');
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
        this.three_properties.push('displacementMap');
        this.scalar_properties.push('displacementScale');
        this.scalar_properties.push('displacementBias');
        this.three_properties.push('roughnessMap');
        this.three_properties.push('metalnessMap');
        this.three_properties.push('alphaMap');
        this.three_properties.push('envMap');
        this.scalar_properties.push('envMapIntensity');
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
        roughnessMap: { deserialize: widgets.unpack_models },
        metalnessMap: { deserialize: widgets.unpack_models },
        alphaMap: { deserialize: widgets.unpack_models },
        envMap: { deserialize: widgets.unpack_models },
    }, MaterialModel.serializers),
    
});

var MeshStandardMaterialView = MaterialView.extend({});

module.exports = {
    MeshStandardMaterialView: MeshStandardMaterialView,
    MeshStandardMaterialModel: MeshStandardMaterialModel,
};
