//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var PlaneBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'PlaneBufferGeometryView',
        _model_name: 'PlaneBufferGeometryModel',

        width: 10,
        height: 10,
        widthSegments: 1,
        heightSegments: 1,

    }),

    constructThreeObject: function() {

        return new THREE.PlaneBufferGeometry(
            this.get('width'),
            this.get('height'),
            this.get('widthSegments'),
            this.get('heightSegments')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('width');
        this.scalar_properties.push('height');
        this.scalar_properties.push('widthSegments');
        this.scalar_properties.push('heightSegments');

    },

});

var PlaneBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    PlaneBufferGeometryView: PlaneBufferGeometryView,
    PlaneBufferGeometryModel: PlaneBufferGeometryModel,
};
