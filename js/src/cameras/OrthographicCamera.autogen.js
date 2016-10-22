//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
        
        this.props_created_by_three['matrixWorldInverse'] = true;
        this.props_created_by_three['projectionMatrix'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['zoom'] = null;
        this.property_converters['left'] = null;
        this.property_converters['right'] = null;
        this.property_converters['top'] = null;
        this.property_converters['bottom'] = null;
        this.property_converters['near'] = null;
        this.property_converters['far'] = null;

    },

});

var OrthographicCameraView = CameraView.extend({});

module.exports = {
    OrthographicCameraView: OrthographicCameraView,
    OrthographicCameraModel: OrthographicCameraModel,
};
