//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var CylinderBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'CylinderBufferGeometryView',
        _model_name: 'CylinderBufferGeometryModel',

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

        return new THREE.CylinderBufferGeometry(
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

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
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

var CylinderBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    CylinderBufferGeometryView: CylinderBufferGeometryView,
    CylinderBufferGeometryModel: CylinderBufferGeometryModel,
};
