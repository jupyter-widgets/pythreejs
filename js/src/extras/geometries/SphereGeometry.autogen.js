//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var SphereGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'SphereGeometryView',
        _model_name: 'SphereGeometryModel',

        radius: 50,
        widthSegments: 8,
        heightSegments: 6,
        phiStart: 0,
        phiLength: 6.283185307179586,
        thetaStart: 0,
        thetaLength: 3.141592653589793,

    }),

    constructThreeObject: function() {

        return new THREE.SphereGeometry(
            this.get('radius'),
            this.get('widthSegments'),
            this.get('heightSegments'),
            this.get('phiStart'),
            this.get('phiLength'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('widthSegments');
        this.scalar_properties.push('heightSegments');
        this.scalar_properties.push('phiStart');
        this.scalar_properties.push('phiLength');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var SphereGeometryView = GeometryView.extend({});

module.exports = {
    SphereGeometryView: SphereGeometryView,
    SphereGeometryModel: SphereGeometryModel,
};
