//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;

var FogModel = require('./Fog').FogModel;
var FogView = require('./Fog').FogView;
var MaterialModel = require('../materials/Material').MaterialModel;
var MaterialView = require('../materials/Material').MaterialView;

var SceneModel = Object3DModel.extend({

    defaults: _.extend({}, Object3DModel.prototype.defaults, {

        _view_name: 'SceneView',
        _model_name: 'SceneModel',

        fog: null,
        overrideMaterial: null,
        autoUpdate: true,

    }),

    constructThreeObject: function() {

        return new THREE.Scene();

    },

    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('fog');
        this.three_properties.push('overrideMaterial');
        this.scalar_properties.push('autoUpdate');

    },

}, {

    serializers: _.extend({
        fog: { deserialize: widgets.unpack_models },
        overrideMaterial: { deserialize: widgets.unpack_models },
    }, Object3DModel.serializers),
    
});

var SceneView = Object3DView.extend({});

module.exports = {
    SceneView: SceneView,
    SceneModel: SceneModel,
};
