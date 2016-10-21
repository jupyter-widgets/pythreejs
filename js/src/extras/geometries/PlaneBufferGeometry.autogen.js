//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:19 GMT-0700 (PDT)
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
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['width'] = null;
        this.property_converters['height'] = null;
        this.property_converters['widthSegments'] = null;
        this.property_converters['heightSegments'] = null;

    },

});

var PlaneBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    PlaneBufferGeometryView: PlaneBufferGeometryView,
    PlaneBufferGeometryModel: PlaneBufferGeometryModel,
};
