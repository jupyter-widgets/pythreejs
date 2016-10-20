//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var TetrahedronGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'TetrahedronGeometryView',
        _model_name: 'TetrahedronGeometryModel',

        radius: 1,
        detail: 0,

    }),

    constructThreeObject: function() {

        return new THREE.TetrahedronGeometry(
            this.get('radius'),
            this.get('detail')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('radius');
        this.scalar_properties.push('detail');

    },

});

var TetrahedronGeometryView = GeometryView.extend({});

module.exports = {
    TetrahedronGeometryView: TetrahedronGeometryView,
    TetrahedronGeometryModel: TetrahedronGeometryModel,
};
