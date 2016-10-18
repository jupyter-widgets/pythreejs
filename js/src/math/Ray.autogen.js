//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
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
            this.get('origin'),
            this.get('direction')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.vector_properties.push('origin');
        this.vector_properties.push('direction');

    },

});

var RayView = ThreeView.extend({});

module.exports = {
    RayView: RayView,
    RayModel: RayModel,
};
