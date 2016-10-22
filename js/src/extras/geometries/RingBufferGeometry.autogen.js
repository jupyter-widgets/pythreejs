//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
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
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['innerRadius'] = null;
        this.property_converters['outerRadius'] = null;
        this.property_converters['thetaSegments'] = null;
        this.property_converters['phiSegments'] = null;
        this.property_converters['thetaStart'] = null;
        this.property_converters['thetaLength'] = null;

    },

});

var RingBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    RingBufferGeometryView: RingBufferGeometryView,
    RingBufferGeometryModel: RingBufferGeometryModel,
};
