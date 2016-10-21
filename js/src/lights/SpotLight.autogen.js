//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
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
            this.convertColorModelToThree(this.get('color'), 'color'),
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
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['target'] = 'convertThreeType';
        this.property_converters['distance'] = null;
        this.property_converters['angle'] = null;
        this.property_converters['penumbra'] = null;
        this.property_converters['decay'] = null;

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
