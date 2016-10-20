//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var LatheGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'LatheGeometryView',
        _model_name: 'LatheGeometryModel',

        points: [],
        segments: 12,
        phiStart: 0,
        phiLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.LatheGeometry(
            this.convertVectorArrayModelToThree(this.get('points')),
            this.get('segments'),
            this.get('phiStart'),
            this.get('phiLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.array_properties.push('points');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('phiStart');
        this.scalar_properties.push('phiLength');

    },

});

var LatheGeometryView = GeometryView.extend({});

module.exports = {
    LatheGeometryView: LatheGeometryView,
    LatheGeometryModel: LatheGeometryModel,
};
