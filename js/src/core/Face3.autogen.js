//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
            this.convertVectorModelToThree(this.get('normal'), 'normal'),
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.get('materialIndex')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['a'] = null;
        this.property_converters['b'] = null;
        this.property_converters['c'] = null;
        this.property_converters['normal'] = 'convertVector';
        this.property_converters['color'] = 'convertColor';
        this.property_converters['materialIndex'] = null;

    },

});

var Face3View = ThreeView.extend({});

module.exports = {
    Face3View: Face3View,
    Face3Model: Face3Model,
};
