//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Line3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Line3View',
        _model_name: 'Line3Model',

        start: [0,0,0],
        end: [0,0,0],

    }),

    constructThreeObject: function() {

        return new THREE.Line3(
            this.convertVectorModelToThree(this.get('start'), 'start'),
            this.convertVectorModelToThree(this.get('end'), 'end')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['start'] = 'convertVector';
        this.property_converters['end'] = 'convertVector';

    },

});

var Line3View = ThreeView.extend({});

module.exports = {
    Line3View: Line3View,
    Line3Model: Line3Model,
};
