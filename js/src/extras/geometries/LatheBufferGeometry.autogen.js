//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
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
            this.convertVectorArrayModelToThree(this.get('points'), 'points'),
            this.get('segments'),
            this.get('phiStart'),
            this.get('phiLength')
        );

    },

    createPropertiesArrays: function() {

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['points'] = 'convertVectorArray';
        this.property_converters['segments'] = null;
        this.property_converters['phiStart'] = null;
        this.property_converters['phiLength'] = null;

    },

});

var LatheBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    LatheBufferGeometryView: LatheBufferGeometryView,
    LatheBufferGeometryModel: LatheBufferGeometryModel,
};
