//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var BinaryTextureLoaderModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'BinaryTextureLoaderView',
        _model_name: 'BinaryTextureLoaderModel',


    }),

    constructThreeObject: function() {

        return new THREE.BinaryTextureLoader();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var BinaryTextureLoaderView = ThreeView.extend({});

module.exports = {
    BinaryTextureLoaderView: BinaryTextureLoaderView,
    BinaryTextureLoaderModel: BinaryTextureLoaderModel,
};
