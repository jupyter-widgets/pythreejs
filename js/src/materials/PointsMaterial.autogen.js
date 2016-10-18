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

var PointsMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'PointsMaterialView',
        _model_name: 'PointsMaterialModel',

        color: "#ffffff",
        map: null,
        size: 1,
        sizeAttenuation: true,
        vertexColors: "NoColors",

    }),

    constructThreeObject: function() {

        return new THREE.PointsMaterial(
            {
                color: this.get('color'),
                map: this.get('map'),
                size: this.get('size'),
                sizeAttenuation: this.get('sizeAttenuation'),
                vertexColors: this.get('vertexColors'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('color');
        this.three_properties.push('map');
        this.scalar_properties.push('size');
        this.scalar_properties.push('sizeAttenuation');
        this.enum_properties.push('vertexColors');
        this.enum_property_types['vertexColors'] = 'Colors';

    },

}, {

    serializers: _.extend({
        map: { deserialize: widgets.unpack_models },
    }, MaterialModel.serializers),
    
});

var PointsMaterialView = MaterialView.extend({});

module.exports = {
    PointsMaterialView: PointsMaterialView,
    PointsMaterialModel: PointsMaterialModel,
};
