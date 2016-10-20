//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var PolyhedronGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'PolyhedronGeometryView',
        _model_name: 'PolyhedronGeometryModel',

        vertices: [],
        indices: [],
        radius: 1,
        detail: 0,
        faces: [],

    }),

    constructThreeObject: function() {

        return new THREE.PolyhedronGeometry(
            this.get('vertices'),
            this.get('faces'),
            this.get('radius'),
            this.get('detail')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.array_properties.push('vertices');
        this.array_properties.push('indices');
        this.scalar_properties.push('radius');
        this.scalar_properties.push('detail');
        this.array_properties.push('faces');
        this.props_created_by_three['faces'] = true;

    },

});

var PolyhedronGeometryView = GeometryView.extend({});

module.exports = {
    PolyhedronGeometryView: PolyhedronGeometryView,
    PolyhedronGeometryModel: PolyhedronGeometryModel,
};
