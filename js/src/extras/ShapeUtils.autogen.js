//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var ShapeUtilsModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'ShapeUtilsView',
        _model_name: 'ShapeUtilsModel',


    }),

    constructThreeObject: function() {

        return new THREE.ShapeUtils();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var ShapeUtilsView = ThreeView.extend({});

module.exports = {
    ShapeUtilsView: ShapeUtilsView,
    ShapeUtilsModel: ShapeUtilsModel,
};
