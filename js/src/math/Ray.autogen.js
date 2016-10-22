//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var RayModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'RayView',
        _model_name: 'RayModel',

        origin: [0,0,0],
        direction: [0,0,0],

    }),

    constructThreeObject: function() {

        return new THREE.Ray(
            this.convertVectorModelToThree(this.get('origin'), 'origin'),
            this.convertVectorModelToThree(this.get('direction'), 'direction')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        

        this.property_converters['origin'] = 'convertVector';
        this.property_converters['direction'] = 'convertVector';

    },

});

var RayView = ThreeView.extend({});

module.exports = {
    RayView: RayView,
    RayModel: RayModel,
};
