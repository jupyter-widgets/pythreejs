//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
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
            this.convertThreeTypeModelToThree(this.get('geometry'), 'geometry')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('geometry');
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['geometry'] = 'convertThreeType';

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
