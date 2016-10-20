//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;


var LightModel = Object3DModel.extend({

    defaults: _.extend({}, Object3DModel.prototype.defaults, {

        _view_name: 'LightView',
        _model_name: 'LightModel',

        color: "#ffffff",
        intensity: 1,

    }),

    constructThreeObject: function() {

        return new THREE.Light(
            this.get('color'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('color');
        this.scalar_properties.push('intensity');

    },

});

var LightView = Object3DView.extend({});

module.exports = {
    LightView: LightView,
    LightModel: LightModel,
};
