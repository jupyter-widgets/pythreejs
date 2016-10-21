//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var HemisphereLightHelperModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'HemisphereLightHelperView',
        _model_name: 'HemisphereLightHelperModel',


    }),

    constructThreeObject: function() {

        return new THREE.HemisphereLightHelper();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var HemisphereLightHelperView = ThreeView.extend({});

module.exports = {
    HemisphereLightHelperView: HemisphereLightHelperView,
    HemisphereLightHelperModel: HemisphereLightHelperModel,
};
