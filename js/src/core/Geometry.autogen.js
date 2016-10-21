//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var GeometryModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'GeometryView',
        _model_name: 'GeometryModel',

        uuid: "",
        name: "",
        type: "",
        vertices: [],
        faces: [],

    }),

    constructThreeObject: function() {

        return new THREE.Geometry();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['uuid'] = null;
        this.property_converters['name'] = null;
        this.property_converters['type'] = null;
        this.property_converters['vertices'] = 'convertVectorArray';
        this.property_converters['faces'] = 'convertFaceArray';

    },

});

var GeometryView = ThreeView.extend({});

module.exports = {
    GeometryView: GeometryView,
    GeometryModel: GeometryModel,
};
