//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:19 GMT-0700 (PDT)
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
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['vertices'] = null;
        this.property_converters['indices'] = null;
        this.property_converters['radius'] = null;
        this.property_converters['detail'] = null;
        this.property_converters['faces'] = null;

    },

});

var PolyhedronGeometryView = GeometryView.extend({});

module.exports = {
    PolyhedronGeometryView: PolyhedronGeometryView,
    PolyhedronGeometryModel: PolyhedronGeometryModel,
};
