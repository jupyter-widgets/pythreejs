//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;

var PlaneModel = require('../math/Plane').PlaneModel;
var PlaneView = require('../math/Plane').PlaneView;

var MaterialModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'MaterialView',
        _model_name: 'MaterialModel',

        uuid: "",
        name: "",
        opacity: 1,
        transparent: false,
        blending: "NormalBlending",
        blendSrc: "SrcAlphaFactor",
        blendDst: "OneMinusSrcAlphaFactor",
        blendEquation: "AddEquation",
        depthTest: true,
        depthFunc: "LessEqualDepth",
        depthWrite: true,
        polygonOffset: false,
        polygonOffsetFactor: 0,
        polygonOffsetUnits: 0,
        alphaTest: 0,
        clippingPlanes: [],
        clipShadows: false,
        overdraw: 0,
        visible: true,
        side: "FrontSide",
        fog: true,
        lights: true,

    }),

    constructThreeObject: function() {

        return new THREE.Material();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('uuid');
        this.scalar_properties.push('name');
        this.scalar_properties.push('opacity');
        this.scalar_properties.push('transparent');
        this.enum_properties.push('blending');
        this.enum_properties.push('blendSrc');
        this.enum_properties.push('blendDst');
        this.enum_properties.push('blendEquation');
        this.scalar_properties.push('depthTest');
        this.enum_properties.push('depthFunc');
        this.scalar_properties.push('depthWrite');
        this.scalar_properties.push('polygonOffset');
        this.scalar_properties.push('polygonOffsetFactor');
        this.scalar_properties.push('polygonOffsetUnits');
        this.scalar_properties.push('alphaTest');
        this.three_array_properties.push('clippingPlanes');
        this.scalar_properties.push('clipShadows');
        this.scalar_properties.push('overdraw');
        this.scalar_properties.push('visible');
        this.enum_properties.push('side');
        this.scalar_properties.push('fog');
        this.scalar_properties.push('lights');
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;
        this.enum_property_types['blending'] = 'BlendingMode';
        this.enum_property_types['blendSrc'] = 'BlendFactors';
        this.enum_property_types['blendDst'] = 'BlendFactors';
        this.enum_property_types['blendEquation'] = 'Equations';
        this.enum_property_types['depthFunc'] = 'DepthMode';
        this.enum_property_types['side'] = 'Side';

    },

}, {

    serializers: _.extend({
        clippingPlanes: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var MaterialView = ThreeView.extend({});

module.exports = {
    MaterialView: MaterialView,
    MaterialModel: MaterialModel,
};
