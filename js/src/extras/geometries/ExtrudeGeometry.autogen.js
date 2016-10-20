//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var ExtrudeGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'ExtrudeGeometryView',
        _model_name: 'ExtrudeGeometryModel',


    }),

    constructThreeObject: function() {

        return new THREE.ExtrudeGeometry();

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);

    },

});

var ExtrudeGeometryView = GeometryView.extend({});

module.exports = {
    ExtrudeGeometryView: ExtrudeGeometryView,
    ExtrudeGeometryModel: ExtrudeGeometryModel,
};
