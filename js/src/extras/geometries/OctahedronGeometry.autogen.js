//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var OctahedronGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'OctahedronGeometryView',
        _model_name: 'OctahedronGeometryModel',

        radius: 1,
        detail: 0,

    }),

    constructThreeObject: function() {

        return new THREE.OctahedronGeometry(
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

        this.property_converters['radius'] = null;
        this.property_converters['detail'] = null;

    },

});

var OctahedronGeometryView = GeometryView.extend({});

module.exports = {
    OctahedronGeometryView: OctahedronGeometryView,
    OctahedronGeometryModel: OctahedronGeometryModel,
};
