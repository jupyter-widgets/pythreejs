//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;


var PointLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'PointLightView',
        _model_name: 'PointLightModel',

        power: 12.566370614359172,
        distance: 0,
        decay: 1,

    }),

    constructThreeObject: function() {

        return new THREE.PointLight(
            this.get('color'),
            this.get('intensity'),
            this.get('distance'),
            this.get('decay')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('power');
        this.scalar_properties.push('distance');
        this.scalar_properties.push('decay');

    },

});

var PointLightView = LightView.extend({});

module.exports = {
    PointLightView: PointLightView,
    PointLightModel: PointLightModel,
};
