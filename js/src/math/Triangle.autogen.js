//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var TriangleModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'TriangleView',
        _model_name: 'TriangleModel',

        a: [0,0,0],
        b: [0,0,0],
        c: [0,0,0],

    }),

    constructThreeObject: function() {

        return new THREE.Triangle(
            this.get('a'),
            this.get('b'),
            this.get('c')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.vector_properties.push('a');
        this.vector_properties.push('b');
        this.vector_properties.push('c');

    },

});

var TriangleView = ThreeView.extend({});

module.exports = {
    TriangleView: TriangleView,
    TriangleModel: TriangleModel,
};
