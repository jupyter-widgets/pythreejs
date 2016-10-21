//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var BoxGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'BoxGeometryView',
        _model_name: 'BoxGeometryModel',

        width: 10,
        height: 10,
        depth: 10,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,

    }),

    constructThreeObject: function() {

        return new THREE.BoxGeometry(
            this.get('width'),
            this.get('height'),
            this.get('depth'),
            this.get('widthSegments'),
            this.get('heightSegments'),
            this.get('depthSegments')
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
        this.property_converters['depth'] = null;
        this.property_converters['widthSegments'] = null;
        this.property_converters['heightSegments'] = null;
        this.property_converters['depthSegments'] = null;

    },

});

var BoxGeometryView = GeometryView.extend({});

module.exports = {
    BoxGeometryView: BoxGeometryView,
    BoxGeometryModel: BoxGeometryModel,
};
