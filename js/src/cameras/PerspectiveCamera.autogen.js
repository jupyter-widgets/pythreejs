//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
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
        
        this.props_created_by_three['matrixWorldInverse'] = true;
        this.props_created_by_three['projectionMatrix'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['fov'] = null;
        this.property_converters['zoom'] = null;
        this.property_converters['near'] = null;
        this.property_converters['far'] = null;
        this.property_converters['focus'] = null;
        this.property_converters['aspect'] = null;

    },

});

var PerspectiveCameraView = CameraView.extend({});

module.exports = {
    PerspectiveCameraView: PerspectiveCameraView,
    PerspectiveCameraModel: PerspectiveCameraModel,
};
