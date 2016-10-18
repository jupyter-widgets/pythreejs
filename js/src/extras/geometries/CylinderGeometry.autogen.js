//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var CylinderGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'CylinderGeometryView',
        _model_name: 'CylinderGeometryModel',

        radiusTop: 20,
        radiusBottom: 20,
        height: 100,
        radiusSegments: 8,
        heightSegments: 1,
        openEnded: false,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.CylinderGeometry(
            this.get('radiusTop'),
            this.get('radiusBottom'),
            this.get('height'),
            this.get('radiusSegments'),
            this.get('heightSegments'),
            this.get('openEnded'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radiusTop');
        this.scalar_properties.push('radiusBottom');
        this.scalar_properties.push('height');
        this.scalar_properties.push('radiusSegments');
        this.scalar_properties.push('heightSegments');
        this.scalar_properties.push('openEnded');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var CylinderGeometryView = GeometryView.extend({});

module.exports = {
    CylinderGeometryView: CylinderGeometryView,
    CylinderGeometryModel: CylinderGeometryModel,
};
