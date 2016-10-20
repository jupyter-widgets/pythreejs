//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;

var SpotLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'SpotLightView',
        _model_name: 'SpotLightModel',

        target: null,
        distance: 0,
        angle: 1.0471975511965976,
        penumbra: 0,
        decay: 1,

    }),

    constructThreeObject: function() {

        return new THREE.SpotLight(
            this.get('color'),
            this.get('intensity'),
            this.get('distance'),
            this.get('angle'),
            this.get('penumbra'),
            this.get('decay')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('target');
        this.scalar_properties.push('distance');
        this.scalar_properties.push('angle');
        this.scalar_properties.push('penumbra');
        this.scalar_properties.push('decay');

    },

}, {

    serializers: _.extend({
        target: { deserialize: widgets.unpack_models },
    }, LightModel.serializers),
    
});

var SpotLightView = LightView.extend({});

module.exports = {
    SpotLightView: SpotLightView,
    SpotLightModel: SpotLightModel,
};
