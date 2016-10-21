//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;

var MaterialModel = require('../materials/Material').MaterialModel;
var MaterialView = require('../materials/Material').MaterialView;
var GeometryModel = require('../core/Geometry').GeometryModel;
var GeometryView = require('../core/Geometry').GeometryView;

var MeshModel = Object3DModel.extend({

    defaults: _.extend({}, Object3DModel.prototype.defaults, {

        _view_name: 'MeshView',
        _model_name: 'MeshModel',

        material: null,
        geometry: null,

    }),

    constructThreeObject: function() {

        return new THREE.Mesh(
            this.convertThreeTypeModelToThree(this.get('geometry'), 'geometry'),
            this.convertThreeTypeModelToThree(this.get('material'), 'material')
        );

    },

    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('material');
        this.three_properties.push('geometry');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['material'] = 'convertThreeType';
        this.property_converters['geometry'] = 'convertThreeType';

    },

}, {

    serializers: _.extend({
        material: { deserialize: widgets.unpack_models },
        geometry: { deserialize: widgets.unpack_models },
    }, Object3DModel.serializers),
    
});

var MeshView = Object3DView.extend({});

module.exports = {
    MeshView: MeshView,
    MeshModel: MeshModel,
};
