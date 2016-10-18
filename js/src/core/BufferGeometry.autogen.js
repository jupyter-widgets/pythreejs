//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var BufferGeometryModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'BufferGeometryView',
        _model_name: 'BufferGeometryModel',

        uuid: "",
        name: "",
        type: "",

    }),

    constructThreeObject: function() {

        return new THREE.BufferGeometry();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('uuid');
        this.scalar_properties.push('name');
        this.scalar_properties.push('type');
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

    },

});

var BufferGeometryView = ThreeView.extend({});

module.exports = {
    BufferGeometryView: BufferGeometryView,
    BufferGeometryModel: BufferGeometryModel,
};
