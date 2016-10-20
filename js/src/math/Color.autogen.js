//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var ColorModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'ColorView',
        _model_name: 'ColorModel',

        r: 1,
        g: 1,
        b: 1,

    }),

    constructThreeObject: function() {

        return new THREE.Color(
            this.get('r'),
            this.get('g'),
            this.get('b')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('r');
        this.scalar_properties.push('g');
        this.scalar_properties.push('b');

    },

});

var ColorView = ThreeView.extend({});

module.exports = {
    ColorView: ColorView,
    ColorModel: ColorModel,
};
