//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var RingGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'RingGeometryView',
        _model_name: 'RingGeometryModel',

        innerRadius: 0,
        outerRadius: 50,
        thetaSegments: 8,
        phiSegments: 8,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.RingGeometry(
            this.get('innerRadius'),
            this.get('outerRadius'),
            this.get('thetaSegments'),
            this.get('phiSegments'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('innerRadius');
        this.scalar_properties.push('outerRadius');
        this.scalar_properties.push('thetaSegments');
        this.scalar_properties.push('phiSegments');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var RingGeometryView = GeometryView.extend({});

module.exports = {
    RingGeometryView: RingGeometryView,
    RingGeometryModel: RingGeometryModel,
};
