//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var TorusGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'TorusGeometryView',
        _model_name: 'TorusGeometryModel',

        radius: 100,
        tube: 40,
        radialSegments: 8,
        tubularSegments: 6,
        arc: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.TorusGeometry(
            this.get('radius'),
            this.get('tube'),
            this.get('radialSegments'),
            this.get('tubularSegments'),
            this.get('arc')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['tube'] = null;
        this.property_converters['radialSegments'] = null;
        this.property_converters['tubularSegments'] = null;
        this.property_converters['arc'] = null;

    },

});

var TorusGeometryView = GeometryView.extend({});

module.exports = {
    TorusGeometryView: TorusGeometryView,
    TorusGeometryModel: TorusGeometryModel,
};
