//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
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
        this.scalar_properties.push('radius');
        this.scalar_properties.push('tube');
        this.scalar_properties.push('radialSegments');
        this.scalar_properties.push('tubularSegments');
        this.scalar_properties.push('arc');

    },

});

var TorusGeometryView = GeometryView.extend({});

module.exports = {
    TorusGeometryView: TorusGeometryView,
    TorusGeometryModel: TorusGeometryModel,
};
