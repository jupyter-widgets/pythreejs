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
                color: this.get('color'),
                map: this.get('map'),
                rotation: this.get('rotation'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('color');
        this.three_properties.push('map');
        this.scalar_properties.push('rotation');

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
