//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:37 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;


var CubeCameraModel = Object3DModel.extend({

    defaults: _.extend({}, Object3DModel.prototype.defaults, {

        _view_name: 'CubeCameraView',
        _model_name: 'CubeCameraModel',


    }),

    constructThreeObject: function() {

        return new THREE.CubeCamera();

    },

    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);

    },

});

var CubeCameraView = Object3DView.extend({});

module.exports = {
    CubeCameraView: CubeCameraView,
    CubeCameraModel: CubeCameraModel,
};
