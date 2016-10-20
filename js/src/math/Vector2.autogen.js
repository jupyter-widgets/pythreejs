//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Vector2Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Vector2View',
        _model_name: 'Vector2Model',

        x: 0,
        y: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Vector2(
            this.get('x'),
            this.get('y')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('x');
        this.scalar_properties.push('y');

    },

});

var Vector2View = ThreeView.extend({});

module.exports = {
    Vector2View: Vector2View,
    Vector2Model: Vector2Model,
};
