//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var TextureModel = require('./Texture').TextureModel;
var TextureView = require('./Texture').TextureView;


var CompressedTextureModel = TextureModel.extend({

    defaults: _.extend({}, TextureModel.prototype.defaults, {

        _view_name: 'CompressedTextureView',
        _model_name: 'CompressedTextureModel',


    }),

    constructThreeObject: function() {

        return new THREE.CompressedTexture();

    },

    createPropertiesArrays: function() {

        TextureModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var CompressedTextureView = TextureView.extend({});

module.exports = {
    CompressedTextureView: CompressedTextureView,
    CompressedTextureModel: CompressedTextureModel,
};
