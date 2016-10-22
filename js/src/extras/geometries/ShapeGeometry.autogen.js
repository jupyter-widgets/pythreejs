//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
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
            this.convertThreeTypeArrayModelToThree(this.get('shapes'), 'shapes')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_array_properties.push('shapes');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['shapes'] = 'convertThreeTypeArray';
        this.property_converters['curveSegments'] = null;
        this.property_converters['material'] = null;

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
