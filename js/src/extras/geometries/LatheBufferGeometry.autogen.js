//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;

var Vector2Model = require('../../math/Vector2').Vector2Model;
var Vector2View = require('../../math/Vector2').Vector2View;

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
            this.get('points'),
            this.get('segments'),
            this.get('phiStart'),
            this.get('phiLength')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_array_properties.push('points');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('phiStart');
        this.scalar_properties.push('phiLength');

    },

}, {

    serializers: _.extend({
        points: { deserialize: widgets.unpack_models },
    }, BufferGeometryModel.serializers),
    
});

var LatheBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    LatheBufferGeometryView: LatheBufferGeometryView,
    LatheBufferGeometryModel: LatheBufferGeometryModel,
};
