//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var TorusKnotBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'TorusKnotBufferGeometryView',
        _model_name: 'TorusKnotBufferGeometryModel',

        radius: 100,
        tube: 40,
        tubularSegments: 64,
        radialSegments: 8,
        p: 2,
        q: 3,

    }),

    constructThreeObject: function() {

        return new THREE.TorusKnotBufferGeometry(
            this.get('radius'),
            this.get('tube'),
            this.get('tubularSegments'),
            this.get('radialSegments'),
            this.get('p'),
            this.get('q')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('tube');
        this.scalar_properties.push('tubularSegments');
        this.scalar_properties.push('radialSegments');
        this.scalar_properties.push('p');
        this.scalar_properties.push('q');

    },

});

var TorusKnotBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    TorusKnotBufferGeometryView: TorusKnotBufferGeometryView,
    TorusKnotBufferGeometryModel: TorusKnotBufferGeometryModel,
};
