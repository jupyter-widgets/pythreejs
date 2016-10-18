//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Face3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Face3View',
        _model_name: 'Face3Model',

        a: 0,
        b: 1,
        c: 2,
        normal: [0,0,0],
        color: "#ffffff",
        materialIndex: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Face3(
            this.get('a'),
            this.get('b'),
            this.get('c'),
            this.get('normal'),
            this.get('color'),
            this.get('materialIndex')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('a');
        this.scalar_properties.push('b');
        this.scalar_properties.push('c');
        this.vector_properties.push('normal');
        this.color_properties.push('color');
        this.scalar_properties.push('materialIndex');

    },

});

var Face3View = ThreeView.extend({});

module.exports = {
    Face3View: Face3View,
    Face3Model: Face3Model,
};
