//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;

var CurveModel = require('../core/Curve').CurveModel;
var CurveView = require('../core/Curve').CurveView;

var TubeGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'TubeGeometryView',
        _model_name: 'TubeGeometryModel',

        path: null,
        segments: 64,
        radius: 1,
        radiusSegments: 8,
        close: false,

    }),

    constructThreeObject: function() {

        return new THREE.TubeGeometry(
            this.get('path'),
            this.get('segments'),
            this.get('radius'),
            this.get('radiusSegments'),
            this.get('close')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('path');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('radius');
        this.scalar_properties.push('radiusSegments');
        this.scalar_properties.push('close');

    },

}, {

    serializers: _.extend({
        path: { deserialize: widgets.unpack_models },
    }, GeometryModel.serializers),
    
});

var TubeGeometryView = GeometryView.extend({});

module.exports = {
    TubeGeometryView: TubeGeometryView,
    TubeGeometryModel: TubeGeometryModel,
};
