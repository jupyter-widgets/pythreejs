//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
            this.convertVectorModelToThree(this.get('min'), 'min'),
            this.convertVectorModelToThree(this.get('max'), 'max')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['min'] = 'convertVector';
        this.property_converters['max'] = 'convertVector';

    },

});

var Box3View = ThreeView.extend({});

module.exports = {
    Box3View: Box3View,
    Box3Model: Box3Model,
};
