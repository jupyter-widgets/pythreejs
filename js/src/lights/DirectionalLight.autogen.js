//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('target');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['target'] = 'convertThreeType';
        this.property_converters['castsShadow'] = null;

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
