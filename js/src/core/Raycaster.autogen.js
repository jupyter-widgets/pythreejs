//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
            this.convertVectorModelToThree(this.get('origin'), 'origin'),
            this.convertVectorModelToThree(this.get('direction'), 'direction'),
            this.get('near'),
            this.get('far')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('ray');
        

        this.property_converters['origin'] = 'convertVector';
        this.property_converters['direction'] = 'convertVector';
        this.property_converters['near'] = null;
        this.property_converters['far'] = null;
        this.property_converters['ray'] = 'convertThreeType';
        this.property_converters['linePrecision'] = null;

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
