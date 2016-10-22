//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
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
            this.convertVectorArrayModelToThree(this.get('points'), 'points'),
            this.get('segments'),
            this.get('phiStart'),
            this.get('phiLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['points'] = 'convertVectorArray';
        this.property_converters['segments'] = null;
        this.property_converters['phiStart'] = null;
        this.property_converters['phiLength'] = null;

    },

});

var LatheGeometryView = GeometryView.extend({});

module.exports = {
    LatheGeometryView: LatheGeometryView,
    LatheGeometryModel: LatheGeometryModel,
};
