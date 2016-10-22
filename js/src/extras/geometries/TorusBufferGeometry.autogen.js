//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
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
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['tube'] = null;
        this.property_converters['radialSegments'] = null;
        this.property_converters['tubularSegments'] = null;
        this.property_converters['arc'] = null;

    },

});

var TorusBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    TorusBufferGeometryView: TorusBufferGeometryView,
    TorusBufferGeometryModel: TorusBufferGeometryModel,
};
