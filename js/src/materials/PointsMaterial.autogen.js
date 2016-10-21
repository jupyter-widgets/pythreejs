//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
                color: this.convertColorModelToThree(this.get('color'), 'color'),
                map: this.convertThreeTypeModelToThree(this.get('map'), 'map'),
                size: this.get('size'),
                sizeAttenuation: this.get('sizeAttenuation'),
                vertexColors: this.convertEnumModelToThree(this.get('vertexColors'), 'vertexColors'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('map');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;
        this.enum_property_types['vertexColors'] = 'Colors';

        this.property_converters['color'] = 'convertColor';
        this.property_converters['map'] = 'convertThreeType';
        this.property_converters['size'] = null;
        this.property_converters['sizeAttenuation'] = null;
        this.property_converters['vertexColors'] = 'convertEnum';

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
