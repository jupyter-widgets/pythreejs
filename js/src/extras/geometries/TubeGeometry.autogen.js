//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;

var CurveModel = require('../core/Curve').CurveModel;
var CurveView = require('../core/Curve').CurveView;

var TubeGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'TubeGeometryView',
        _model_name: 'TubeGeometryModel',

        path: null,
        segments: 64,
        radius: 1,
        radiusSegments: 8,
        close: false,

    }),

    constructThreeObject: function() {

        return new THREE.TubeGeometry(
            this.convertThreeTypeModelToThree(this.get('path'), 'path'),
            this.get('segments'),
            this.get('radius'),
            this.get('radiusSegments'),
            this.get('close')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('path');
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['path'] = 'convertThreeType';
        this.property_converters['segments'] = null;
        this.property_converters['radius'] = null;
        this.property_converters['radiusSegments'] = null;
        this.property_converters['close'] = null;

    },

}, {

    serializers: _.extend({
        path: { deserialize: widgets.unpack_models },
    }, GeometryModel.serializers),
    
});

var TubeGeometryView = GeometryView.extend({});

module.exports = {
    TubeGeometryView: TubeGeometryView,
    TubeGeometryModel: TubeGeometryModel,
};
