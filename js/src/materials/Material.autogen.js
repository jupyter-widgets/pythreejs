//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
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
        this.three_array_properties.push('clippingPlanes');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;
        this.enum_property_types['blending'] = 'BlendingMode';
        this.enum_property_types['blendSrc'] = 'BlendFactors';
        this.enum_property_types['blendDst'] = 'BlendFactors';
        this.enum_property_types['blendEquation'] = 'Equations';
        this.enum_property_types['depthFunc'] = 'DepthMode';
        this.enum_property_types['side'] = 'Side';

        this.property_converters['uuid'] = null;
        this.property_converters['name'] = null;
        this.property_converters['opacity'] = null;
        this.property_converters['transparent'] = null;
        this.property_converters['blending'] = 'convertEnum';
        this.property_converters['blendSrc'] = 'convertEnum';
        this.property_converters['blendDst'] = 'convertEnum';
        this.property_converters['blendEquation'] = 'convertEnum';
        this.property_converters['depthTest'] = null;
        this.property_converters['depthFunc'] = 'convertEnum';
        this.property_converters['depthWrite'] = null;
        this.property_converters['polygonOffset'] = null;
        this.property_converters['polygonOffsetFactor'] = null;
        this.property_converters['polygonOffsetUnits'] = null;
        this.property_converters['alphaTest'] = null;
        this.property_converters['clippingPlanes'] = 'convertThreeTypeArray';
        this.property_converters['clipShadows'] = null;
        this.property_converters['overdraw'] = null;
        this.property_converters['visible'] = null;
        this.property_converters['side'] = 'convertEnum';
        this.property_converters['fog'] = null;
        this.property_converters['lights'] = null;

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
