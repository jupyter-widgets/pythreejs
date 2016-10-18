//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;

var DirectionalLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'DirectionalLightView',
        _model_name: 'DirectionalLightModel',

        target: null,
        castsShadow: false,

    }),

    constructThreeObject: function() {

        return new THREE.DirectionalLight(
            this.get('color'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('target');
        this.scalar_properties.push('castsShadow');

    },

}, {

    serializers: _.extend({
        target: { deserialize: widgets.unpack_models },
    }, LightModel.serializers),
    
});

var DirectionalLightView = LightView.extend({});

module.exports = {
    DirectionalLightView: DirectionalLightView,
    DirectionalLightModel: DirectionalLightModel,
};
