//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Box3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Box3View',
        _model_name: 'Box3Model',

        min: [0,0,0],
        max: [0,0,0],

    }),

    constructThreeObject: function() {

        return new THREE.Box3(
            this.convertVectorModelToThree(this.get('min')),
            this.convertVectorModelToThree(this.get('max'))
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.vector_properties.push('min');
        this.vector_properties.push('max');

    },

});

var Box3View = ThreeView.extend({});

module.exports = {
    Box3View: Box3View,
    Box3Model: Box3Model,
};
