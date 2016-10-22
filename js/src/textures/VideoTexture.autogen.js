//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var VideoTextureModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'VideoTextureView',
        _model_name: 'VideoTextureModel',


    }),

    constructThreeObject: function() {

        return new THREE.VideoTexture();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var VideoTextureView = ThreeView.extend({});

module.exports = {
    VideoTextureView: VideoTextureView,
    VideoTextureModel: VideoTextureModel,
};
