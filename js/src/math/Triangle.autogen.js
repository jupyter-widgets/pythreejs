//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
            this.convertVectorModelToThree(this.get('a'), 'a'),
            this.convertVectorModelToThree(this.get('b'), 'b'),
            this.convertVectorModelToThree(this.get('c'), 'c')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['a'] = 'convertVector';
        this.property_converters['b'] = 'convertVector';
        this.property_converters['c'] = 'convertVector';

    },

});

var TriangleView = ThreeView.extend({});

module.exports = {
    TriangleView: TriangleView,
    TriangleModel: TriangleModel,
};
