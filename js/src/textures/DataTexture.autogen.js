//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var TextureModel = require('./Texture').TextureModel;
var TextureView = require('./Texture').TextureView;


var DataTextureModel = TextureModel.extend({

    defaults: _.extend({}, TextureModel.prototype.defaults, {

        _view_name: 'DataTextureView',
        _model_name: 'DataTextureModel',


    }),

    constructThreeObject: function() {

        return new THREE.DataTexture();

    },

    createPropertiesArrays: function() {

        TextureModel.prototype.createPropertiesArrays.call(this);

    },

});

var DataTextureView = TextureView.extend({});

module.exports = {
    DataTextureView: DataTextureView,
    DataTextureModel: DataTextureModel,
};
