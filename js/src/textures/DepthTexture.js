var _ = require('underscore');
var DepthTextureBase = require('./DepthTexture.autogen');

var DepthTextureView = DepthTextureBase.DepthTextureView.extend({});

var DepthTextureModel = DepthTextureBase.DepthTextureModel.extend({

    createPropertiesArrays: function() {
        DepthTextureBase.DepthTextureModel.prototype.createPropertiesArrays.call(this);

        // three.js DepthTexture stores the width, and height props together in a dict called 'image'
        this.property_mappers['DepthTextureData'] = 'mapDepthTextureData';
    },


    mapDepthTextureDataModelToThree: function() {
    	var width = this.get('width');
    	var height = this.get('height');
    	this.obj.image = { width: width, height: height };
    	this.obj.needsUpdate = true;
    },

    mapDepthTextureDataThreeToModel: function() {
    	var imageRecord = this.obj.image;

		// this.image = { width: width, height: height };
    	var dataWidth = imageRecord.width;
    	var dataHeight = imageRecord.height;

    	this.set('width', dataWidth);
    	this.set('height', dataHeight);
    },

});

module.exports = {
    DepthTextureModel: DepthTextureModel,
    DepthTextureView: DepthTextureView,
};
