//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var LensFlareModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'LensFlareView',
        _model_name: 'LensFlareModel',


    }),

    constructThreeObject: function() {

        return new THREE.LensFlare();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);

    },

});

var LensFlareView = ThreeView.extend({});

module.exports = {
    LensFlareView: LensFlareView,
    LensFlareModel: LensFlareModel,
};
