//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var EulerModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'EulerView',
        _model_name: 'EulerModel',

        x: 0,
        y: 0,
        z: 0,
        order: "XYZ",

    }),

    constructThreeObject: function() {

        return new THREE.Euler(
            this.get('x'),
            this.get('y'),
            this.get('z'),
            this.get('order')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['x'] = null;
        this.property_converters['y'] = null;
        this.property_converters['z'] = null;
        this.property_converters['order'] = null;

    },

});

var EulerView = ThreeView.extend({});

module.exports = {
    EulerView: EulerView,
    EulerModel: EulerModel,
};
