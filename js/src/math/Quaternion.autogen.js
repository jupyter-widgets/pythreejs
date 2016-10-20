//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var QuaternionModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'QuaternionView',
        _model_name: 'QuaternionModel',

        x: 0,
        y: 0,
        z: 0,
        w: 1,

    }),

    constructThreeObject: function() {

        return new THREE.Quaternion(
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

var QuaternionView = ThreeView.extend({});

module.exports = {
    QuaternionView: QuaternionView,
    QuaternionModel: QuaternionModel,
};
