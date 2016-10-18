//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var TorusKnotGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'TorusKnotGeometryView',
        _model_name: 'TorusKnotGeometryModel',

        radius: 100,
        tube: 40,
        tubularSegments: 64,
        radialSegments: 8,
        p: 2,
        q: 3,

    }),

    constructThreeObject: function() {

        return new THREE.TorusKnotGeometry(
            this.get('radius'),
            this.get('tube'),
            this.get('tubularSegments'),
            this.get('radialSegments'),
            this.get('p'),
            this.get('q')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('tube');
        this.scalar_properties.push('tubularSegments');
        this.scalar_properties.push('radialSegments');
        this.scalar_properties.push('p');
        this.scalar_properties.push('q');

    },

});

var TorusKnotGeometryView = GeometryView.extend({});

module.exports = {
    TorusKnotGeometryView: TorusKnotGeometryView,
    TorusKnotGeometryModel: TorusKnotGeometryModel,
};
