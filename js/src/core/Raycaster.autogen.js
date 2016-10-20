//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;

var RayModel = require('../math/Ray').RayModel;
var RayView = require('../math/Ray').RayView;

var RaycasterModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'RaycasterView',
        _model_name: 'RaycasterModel',

        origin: [0,0,0],
        direction: [0,0,0],
        near: 0,
        far: 1000000,
        ray: null,
        linePrecision: 1,

    }),

    constructThreeObject: function() {

        return new THREE.Raycaster(
            this.convertVectorModelToThree(this.get('origin')),
            this.convertVectorModelToThree(this.get('direction')),
            this.get('near'),
            this.get('far')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.vector_properties.push('origin');
        this.vector_properties.push('direction');
        this.scalar_properties.push('near');
        this.scalar_properties.push('far');
        this.three_properties.push('ray');
        this.scalar_properties.push('linePrecision');

    },

}, {

    serializers: _.extend({
        ray: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var RaycasterView = ThreeView.extend({});

module.exports = {
    RaycasterView: RaycasterView,
    RaycasterModel: RaycasterModel,
};
