//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var ParametricGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'ParametricGeometryView',
        _model_name: 'ParametricGeometryModel',

        func: function (u,v) { return THREE.Vector3(); },
        slices: 3,
        stacks: 3,

    }),

    constructThreeObject: function() {

        return new THREE.ParametricGeometry(
            this.convertFunctionModelToThree(this.get('func')),
            this.get('slices'),
            this.get('stacks')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.function_properties.push('func');
        this.scalar_properties.push('slices');
        this.scalar_properties.push('stacks');

    },

});

var ParametricGeometryView = GeometryView.extend({});

module.exports = {
    ParametricGeometryView: ParametricGeometryView,
    ParametricGeometryModel: ParametricGeometryModel,
};
