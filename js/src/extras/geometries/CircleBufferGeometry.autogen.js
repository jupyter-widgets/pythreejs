//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var CircleBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'CircleBufferGeometryView',
        _model_name: 'CircleBufferGeometryModel',

        radius: 50,
        segments: 8,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.CircleBufferGeometry(
            this.get('radius'),
            this.get('segments'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var CircleBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    CircleBufferGeometryView: CircleBufferGeometryView,
    CircleBufferGeometryModel: CircleBufferGeometryModel,
};
