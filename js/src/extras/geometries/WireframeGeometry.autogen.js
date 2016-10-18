//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var WireframeGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'WireframeGeometryView',
        _model_name: 'WireframeGeometryModel',


    }),

    constructThreeObject: function() {

        return new THREE.WireframeGeometry();

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);

    },

});

var WireframeGeometryView = GeometryView.extend({});

module.exports = {
    WireframeGeometryView: WireframeGeometryView,
    WireframeGeometryModel: WireframeGeometryModel,
};
