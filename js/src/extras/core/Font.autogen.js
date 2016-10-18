//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var FontModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'FontView',
        _model_name: 'FontModel',


    }),

    constructThreeObject: function() {

        return new THREE.Font();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);

    },

});

var FontView = ThreeView.extend({});

module.exports = {
    FontView: FontView,
    FontModel: FontModel,
};
