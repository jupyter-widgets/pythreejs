//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Vector4Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Vector4View',
        _model_name: 'Vector4Model',

        x: 0,
        y: 0,
        z: 0,
        w: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Vector4(
            this.get('x'),
            this.get('y'),
            this.get('z'),
            this.get('w')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('x');
        this.scalar_properties.push('y');
        this.scalar_properties.push('z');
        this.scalar_properties.push('w');

    },

});

var Vector4View = ThreeView.extend({});

module.exports = {
    Vector4View: Vector4View,
    Vector4Model: Vector4Model,
};
