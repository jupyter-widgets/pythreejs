//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var TorusBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'TorusBufferGeometryView',
        _model_name: 'TorusBufferGeometryModel',

        radius: 100,
        tube: 40,
        radialSegments: 8,
        tubularSegments: 6,
        arc: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.TorusBufferGeometry(
            this.get('radius'),
            this.get('tube'),
            this.get('radialSegments'),
            this.get('tubularSegments'),
            this.get('arc')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('tube');
        this.scalar_properties.push('radialSegments');
        this.scalar_properties.push('tubularSegments');
        this.scalar_properties.push('arc');

    },

});

var TorusBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    TorusBufferGeometryView: TorusBufferGeometryView,
    TorusBufferGeometryModel: TorusBufferGeometryModel,
};
