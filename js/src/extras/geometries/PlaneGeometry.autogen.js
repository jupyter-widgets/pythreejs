//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var PlaneGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'PlaneGeometryView',
        _model_name: 'PlaneGeometryModel',

        width: 10,
        height: 10,
        widthSegments: 1,
        heightSegments: 1,

    }),

    constructThreeObject: function() {

        return new THREE.PlaneGeometry(
            this.get('width'),
            this.get('height'),
            this.get('widthSegments'),
            this.get('heightSegments')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('width');
        this.scalar_properties.push('height');
        this.scalar_properties.push('widthSegments');
        this.scalar_properties.push('heightSegments');

    },

});

var PlaneGeometryView = GeometryView.extend({});

module.exports = {
    PlaneGeometryView: PlaneGeometryView,
    PlaneGeometryModel: PlaneGeometryModel,
};
