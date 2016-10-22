//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
                color: this.convertColorModelToThree(this.get('color'), 'color'),
                map: this.convertThreeTypeModelToThree(this.get('map'), 'map'),
                aoMap: this.convertThreeTypeModelToThree(this.get('aoMap'), 'aoMap'),
                aoMapIntensity: this.get('aoMapIntensity'),
                specularMap: this.convertThreeTypeModelToThree(this.get('specularMap'), 'specularMap'),
                alphaMap: this.convertThreeTypeModelToThree(this.get('alphaMap'), 'alphaMap'),
                envMap: this.convertThreeTypeModelToThree(this.get('envMap'), 'envMap'),
                combine: this.convertEnumModelToThree(this.get('combine'), 'combine'),
                reflectivity: this.get('reflectivity'),
                refractionRatio: this.get('refractionRatio'),
                fog: this.get('fog'),
                shading: this.convertEnumModelToThree(this.get('shading'), 'shading'),
                wireframe: this.get('wireframe'),
                wireframeLinewidth: this.get('wireframeLinewidth'),
                wireframeLinecap: this.get('wireframeLinecap'),
                wireframeLinejoin: this.get('wireframeLinejoin'),
                vertexColors: this.convertEnumModelToThree(this.get('vertexColors'), 'vertexColors'),
                skinning: this.get('skinning'),
                morphTargets: this.get('morphTargets'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('map');
        this.three_properties.push('aoMap');
        this.three_properties.push('specularMap');
        this.three_properties.push('alphaMap');
        this.three_properties.push('envMap');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;
        this.enum_property_types['combine'] = 'Operations';
        this.enum_property_types['shading'] = 'Shading';
        this.enum_property_types['vertexColors'] = 'Colors';

        this.property_converters['color'] = 'convertColor';
        this.property_converters['map'] = 'convertThreeType';
        this.property_converters['aoMap'] = 'convertThreeType';
        this.property_converters['aoMapIntensity'] = null;
        this.property_converters['specularMap'] = 'convertThreeType';
        this.property_converters['alphaMap'] = 'convertThreeType';
        this.property_converters['envMap'] = 'convertThreeType';
        this.property_converters['combine'] = 'convertEnum';
        this.property_converters['reflectivity'] = null;
        this.property_converters['refractionRatio'] = null;
        this.property_converters['fog'] = null;
        this.property_converters['shading'] = 'convertEnum';
        this.property_converters['wireframe'] = null;
        this.property_converters['wireframeLinewidth'] = null;
        this.property_converters['wireframeLinecap'] = null;
        this.property_converters['wireframeLinejoin'] = null;
        this.property_converters['vertexColors'] = 'convertEnum';
        this.property_converters['skinning'] = null;
        this.property_converters['morphTargets'] = null;

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
