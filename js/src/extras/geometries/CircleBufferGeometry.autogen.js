//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
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
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['segments'] = null;
        this.property_converters['thetaStart'] = null;
        this.property_converters['thetaLength'] = null;

    },

});

var CircleBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    CircleBufferGeometryView: CircleBufferGeometryView,
    CircleBufferGeometryModel: CircleBufferGeometryModel,
};
