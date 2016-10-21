//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var SphereModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'SphereView',
        _model_name: 'SphereModel',

        center: [0,0,0],
        radius: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Sphere(
            this.convertVectorModelToThree(this.get('center'), 'center'),
            this.get('radius')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['center'] = 'convertVector';
        this.property_converters['radius'] = null;

    },

});

var SphereView = ThreeView.extend({});

module.exports = {
    SphereView: SphereView,
    SphereModel: SphereModel,
};
