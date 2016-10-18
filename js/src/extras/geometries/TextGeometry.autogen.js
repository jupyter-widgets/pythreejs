//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var TextGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'TextGeometryView',
        _model_name: 'TextGeometryModel',


    }),

    constructThreeObject: function() {

        return new THREE.TextGeometry();

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);

    },

});

var TextGeometryView = GeometryView.extend({});

module.exports = {
    TextGeometryView: TextGeometryView,
    TextGeometryModel: TextGeometryModel,
};
