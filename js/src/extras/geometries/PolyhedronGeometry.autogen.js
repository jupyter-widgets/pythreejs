//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
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
        faces: [],
        radius: 1,
        detail: 0,

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
        this.array_properties.push('faces');
        this.scalar_properties.push('radius');
        this.scalar_properties.push('detail');

    },

});

var PolyhedronGeometryView = GeometryView.extend({});

module.exports = {
    PolyhedronGeometryView: PolyhedronGeometryView,
    PolyhedronGeometryModel: PolyhedronGeometryModel,
};
