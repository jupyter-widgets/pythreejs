//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var BoxBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'BoxBufferGeometryView',
        _model_name: 'BoxBufferGeometryModel',

        width: 10,
        height: 10,
        depth: 10,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,

    }),

    constructThreeObject: function() {

        return new THREE.BoxBufferGeometry(
            this.get('width'),
            this.get('height'),
            this.get('depth'),
            this.get('widthSegments'),
            this.get('heightSegments'),
            this.get('depthSegments')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('width');
        this.scalar_properties.push('height');
        this.scalar_properties.push('depth');
        this.scalar_properties.push('widthSegments');
        this.scalar_properties.push('heightSegments');
        this.scalar_properties.push('depthSegments');

    },

});

var BoxBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    BoxBufferGeometryView: BoxBufferGeometryView,
    BoxBufferGeometryModel: BoxBufferGeometryModel,
};
