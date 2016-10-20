//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var LatheBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'LatheBufferGeometryView',
        _model_name: 'LatheBufferGeometryModel',

        points: [],
        segments: 12,
        phiStart: 0,
        phiLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.LatheBufferGeometry(
            this.convertVectorArrayModelToThree(this.get('points')),
            this.get('segments'),
            this.get('phiStart'),
            this.get('phiLength')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.array_properties.push('points');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('phiStart');
        this.scalar_properties.push('phiLength');

    },

});

var LatheBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    LatheBufferGeometryView: LatheBufferGeometryView,
    LatheBufferGeometryModel: LatheBufferGeometryModel,
};
