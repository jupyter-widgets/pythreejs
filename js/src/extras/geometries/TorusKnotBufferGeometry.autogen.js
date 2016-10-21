//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['tube'] = null;
        this.property_converters['tubularSegments'] = null;
        this.property_converters['radialSegments'] = null;
        this.property_converters['p'] = null;
        this.property_converters['q'] = null;

    },

});

var TorusKnotBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    TorusKnotBufferGeometryView: TorusKnotBufferGeometryView,
    TorusKnotBufferGeometryModel: TorusKnotBufferGeometryModel,
};
