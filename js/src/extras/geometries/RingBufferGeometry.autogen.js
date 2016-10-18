//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var RingBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'RingBufferGeometryView',
        _model_name: 'RingBufferGeometryModel',

        innerRadius: 0,
        outerRadius: 50,
        thetaSegments: 8,
        phiSegments: 8,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.RingBufferGeometry(
            this.get('innerRadius'),
            this.get('outerRadius'),
            this.get('thetaSegments'),
            this.get('phiSegments'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('innerRadius');
        this.scalar_properties.push('outerRadius');
        this.scalar_properties.push('thetaSegments');
        this.scalar_properties.push('phiSegments');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var RingBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    RingBufferGeometryView: RingBufferGeometryView,
    RingBufferGeometryModel: RingBufferGeometryModel,
};
