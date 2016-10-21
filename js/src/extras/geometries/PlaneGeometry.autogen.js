//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var PlaneGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'PlaneGeometryView',
        _model_name: 'PlaneGeometryModel',

        width: 10,
        height: 10,
        widthSegments: 1,
        heightSegments: 1,

    }),

    constructThreeObject: function() {

        return new THREE.PlaneGeometry(
            this.get('width'),
            this.get('height'),
            this.get('widthSegments'),
            this.get('heightSegments')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['width'] = null;
        this.property_converters['height'] = null;
        this.property_converters['widthSegments'] = null;
        this.property_converters['heightSegments'] = null;

    },

});

var PlaneGeometryView = GeometryView.extend({});

module.exports = {
    PlaneGeometryView: PlaneGeometryView,
    PlaneGeometryModel: PlaneGeometryModel,
};
