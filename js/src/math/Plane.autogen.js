//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var PlaneModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'PlaneView',
        _model_name: 'PlaneModel',

        normal: [0,0,0],
        constant: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Plane(
            this.convertVectorModelToThree(this.get('normal'), 'normal'),
            this.get('constant')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['normal'] = 'convertVector';
        this.property_converters['constant'] = null;

    },

});

var PlaneView = ThreeView.extend({});

module.exports = {
    PlaneView: PlaneView,
    PlaneModel: PlaneModel,
};
