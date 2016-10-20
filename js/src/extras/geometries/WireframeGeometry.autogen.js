//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;
var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;

var WireframeGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'WireframeGeometryView',
        _model_name: 'WireframeGeometryModel',

        geometry: null,

    }),

    constructThreeObject: function() {

        return new THREE.WireframeGeometry(
            this.convertThreeTypeModelToThree(this.get('geometry'))
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('geometry');

    },

}, {

    serializers: _.extend({
        geometry: { deserialize: widgets.unpack_models },
    }, GeometryModel.serializers),
    
});

var WireframeGeometryView = GeometryView.extend({});

module.exports = {
    WireframeGeometryView: WireframeGeometryView,
    WireframeGeometryModel: WireframeGeometryModel,
};
