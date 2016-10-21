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

var SpriteMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'SpriteMaterialView',
        _model_name: 'SpriteMaterialModel',

        color: "#ffffff",
        map: null,
        rotation: 0,

    }),

    constructThreeObject: function() {

        return new THREE.SpriteMaterial(
            {
                color: this.convertColorModelToThree(this.get('color'), 'color'),
                map: this.convertThreeTypeModelToThree(this.get('map'), 'map'),
                rotation: this.get('rotation'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('map');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['color'] = 'convertColor';
        this.property_converters['map'] = 'convertThreeType';
        this.property_converters['rotation'] = null;

    },

}, {

    serializers: _.extend({
        map: { deserialize: widgets.unpack_models },
    }, MaterialModel.serializers),
    
});

var SpriteMaterialView = MaterialView.extend({});

module.exports = {
    SpriteMaterialView: SpriteMaterialView,
    SpriteMaterialModel: SpriteMaterialModel,
};
