//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
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
            this.convertVectorModelToThree(this.get('normal')),
            this.get('constant')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.vector_properties.push('normal');
        this.scalar_properties.push('constant');

    },

});

var PlaneView = ThreeView.extend({});

module.exports = {
    PlaneView: PlaneView,
    PlaneModel: PlaneModel,
};
