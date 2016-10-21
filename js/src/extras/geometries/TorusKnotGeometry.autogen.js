//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['tube'] = null;
        this.property_converters['tubularSegments'] = null;
        this.property_converters['radialSegments'] = null;
        this.property_converters['p'] = null;
        this.property_converters['q'] = null;

    },

});

var TorusKnotGeometryView = GeometryView.extend({});

module.exports = {
    TorusKnotGeometryView: TorusKnotGeometryView,
    TorusKnotGeometryModel: TorusKnotGeometryModel,
};
