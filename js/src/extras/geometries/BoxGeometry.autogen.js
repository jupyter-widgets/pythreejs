//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var BoxGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'BoxGeometryView',
        _model_name: 'BoxGeometryModel',

        width: 10,
        height: 10,
        depth: 10,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,

    }),

    constructThreeObject: function() {

        return new THREE.BoxGeometry(
            this.get('width'),
            this.get('height'),
            this.get('depth'),
            this.get('widthSegments'),
            this.get('heightSegments'),
            this.get('depthSegments')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('width');
        this.scalar_properties.push('height');
        this.scalar_properties.push('depth');
        this.scalar_properties.push('widthSegments');
        this.scalar_properties.push('heightSegments');
        this.scalar_properties.push('depthSegments');

    },

});

var BoxGeometryView = GeometryView.extend({});

module.exports = {
    BoxGeometryView: BoxGeometryView,
    BoxGeometryModel: BoxGeometryModel,
};
