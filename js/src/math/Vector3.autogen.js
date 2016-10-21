//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Vector3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Vector3View',
        _model_name: 'Vector3Model',

        x: 0,
        y: 0,
        z: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Vector3(
            this.get('x'),
            this.get('y'),
            this.get('z')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['x'] = null;
        this.property_converters['y'] = null;
        this.property_converters['z'] = null;

    },

});

var Vector3View = ThreeView.extend({});

module.exports = {
    Vector3View: Vector3View,
    Vector3Model: Vector3Model,
};
