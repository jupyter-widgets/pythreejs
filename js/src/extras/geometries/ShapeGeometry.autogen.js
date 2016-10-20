//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;

var ShapeModel = require('../core/Shape').ShapeModel;
var ShapeView = require('../core/Shape').ShapeView;

var ShapeGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'ShapeGeometryView',
        _model_name: 'ShapeGeometryModel',

        shapes: [],
        curveSegments: 12,
        material: 0,

    }),

    constructThreeObject: function() {

        return new THREE.ShapeGeometry(
            this.convertThreeTypeArrayModelToThree(this.get('shapes'))
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_array_properties.push('shapes');
        this.scalar_properties.push('curveSegments');
        this.scalar_properties.push('material');

    },

}, {

    serializers: _.extend({
        shapes: { deserialize: widgets.unpack_models },
    }, GeometryModel.serializers),
    
});

var ShapeGeometryView = GeometryView.extend({});

module.exports = {
    ShapeGeometryView: ShapeGeometryView,
    ShapeGeometryModel: ShapeGeometryModel,
};
