//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var CameraModel = require('./Camera').CameraModel;
var CameraView = require('./Camera').CameraView;


var PerspectiveCameraModel = CameraModel.extend({

    defaults: _.extend({}, CameraModel.prototype.defaults, {

        _view_name: 'PerspectiveCameraView',
        _model_name: 'PerspectiveCameraModel',

        fov: 50,
        zoom: 1,
        near: 0.1,
        far: 2000,
        focus: 10,
        aspect: 1,

    }),

    constructThreeObject: function() {

        return new THREE.PerspectiveCamera(
            this.get('fov'),
            this.get('aspect'),
            this.get('near'),
            this.get('far')
        );

    },

    createPropertiesArrays: function() {

        CameraModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('fov');
        this.scalar_properties.push('zoom');
        this.scalar_properties.push('near');
        this.scalar_properties.push('far');
        this.scalar_properties.push('focus');
        this.scalar_properties.push('aspect');

    },

});

var PerspectiveCameraView = CameraView.extend({});

module.exports = {
    PerspectiveCameraView: PerspectiveCameraView,
    PerspectiveCameraModel: PerspectiveCameraModel,
};
