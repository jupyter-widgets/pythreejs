//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;


var CameraModel = Object3DModel.extend({

    defaults: _.extend({}, Object3DModel.prototype.defaults, {

        _view_name: 'CameraView',
        _model_name: 'CameraModel',

        matrixWorldInverse: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        projectionMatrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],

    }),

    constructThreeObject: function() {

        return new THREE.Camera();

    },

    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['matrixWorldInverse'] = true;
        this.props_created_by_three['projectionMatrix'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['matrixWorldInverse'] = 'convertMatrix';
        this.property_converters['projectionMatrix'] = 'convertMatrix';

    },

});

var CameraView = Object3DView.extend({});

module.exports = {
    CameraView: CameraView,
    CameraModel: CameraModel,
};
