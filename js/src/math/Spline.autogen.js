//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;

var Vector3Model = require('./Vector3').Vector3Model;
var Vector3View = require('./Vector3').Vector3View;

var SplineModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'SplineView',
        _model_name: 'SplineModel',

        points: [],

    }),

    constructThreeObject: function() {

        return new THREE.Spline(
            this.convertThreeTypeArrayModelToThree(this.get('points'), 'points')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.three_array_properties.push('points');
        

        this.property_converters['points'] = 'convertThreeTypeArray';

    },

}, {

    serializers: _.extend({
        points: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var SplineView = ThreeView.extend({});

module.exports = {
    SplineView: SplineView,
    SplineModel: SplineModel,
};
