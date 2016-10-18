//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Box2Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Box2View',
        _model_name: 'Box2Model',

        min: [0,0],
        max: [0,0],

    }),

    constructThreeObject: function() {

        return new THREE.Box2(
            this.get('min'),
            this.get('max')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.vector_properties.push('min');
        this.vector_properties.push('max');

    },

});

var Box2View = ThreeView.extend({});

module.exports = {
    Box2View: Box2View,
    Box2Model: Box2Model,
};
