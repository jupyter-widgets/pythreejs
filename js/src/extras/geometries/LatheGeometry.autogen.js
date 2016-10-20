//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;

var Vector2Model = require('../../math/Vector2').Vector2Model;
var Vector2View = require('../../math/Vector2').Vector2View;

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
            this.get('points'),
            this.get('segments'),
            this.get('phiStart'),
            this.get('phiLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_array_properties.push('points');
        this.scalar_properties.push('segments');
        this.scalar_properties.push('phiStart');
        this.scalar_properties.push('phiLength');

    },

}, {

    serializers: _.extend({
        points: { deserialize: widgets.unpack_models },
    }, GeometryModel.serializers),
    
});

var LatheGeometryView = GeometryView.extend({});

module.exports = {
    LatheGeometryView: LatheGeometryView,
    LatheGeometryModel: LatheGeometryModel,
};
