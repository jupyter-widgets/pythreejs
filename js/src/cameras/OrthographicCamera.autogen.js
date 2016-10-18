//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var CameraModel = require('./Camera').CameraModel;
var CameraView = require('./Camera').CameraView;


var OrthographicCameraModel = CameraModel.extend({

    defaults: _.extend({}, CameraModel.prototype.defaults, {

        _view_name: 'OrthographicCameraView',
        _model_name: 'OrthographicCameraModel',

        zoom: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        near: 0.1,
        far: 2000,

    }),

    constructThreeObject: function() {

        return new THREE.OrthographicCamera(
            this.get('left'),
            this.get('right'),
            this.get('top'),
            this.get('bottom'),
            this.get('near'),
            this.get('far')
        );

    },

    createPropertiesArrays: function() {

        CameraModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('zoom');
        this.scalar_properties.push('left');
        this.scalar_properties.push('right');
        this.scalar_properties.push('top');
        this.scalar_properties.push('bottom');
        this.scalar_properties.push('near');
        this.scalar_properties.push('far');

    },

});

var OrthographicCameraView = CameraView.extend({});

module.exports = {
    OrthographicCameraView: OrthographicCameraView,
    OrthographicCameraModel: OrthographicCameraModel,
};
