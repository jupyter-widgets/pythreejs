//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var GridHelperModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'GridHelperView',
        _model_name: 'GridHelperModel',


    }),

    constructThreeObject: function() {

        return new THREE.GridHelper();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var GridHelperView = ThreeView.extend({});

module.exports = {
    GridHelperView: GridHelperView,
    GridHelperModel: GridHelperModel,
};
