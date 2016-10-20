//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var CircleGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'CircleGeometryView',
        _model_name: 'CircleGeometryModel',

        radius: 50,
        segments: 8,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.CircleGeometry(
            this.get('radius'),
            this.get('segments'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var CircleGeometryView = GeometryView.extend({});

module.exports = {
    CircleGeometryView: CircleGeometryView,
    CircleGeometryModel: CircleGeometryModel,
};
