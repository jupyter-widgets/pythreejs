var _ = require('underscore');
var DataTextureBase = require('./DataTexture.autogen');

var DataTextureView = DataTextureBase.DataTextureView.extend({});

var DataTextureModel = DataTextureBase.DataTextureModel.extend({

    createPropertiesArrays: function() {
        DataTextureBase.DataTextureModel.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['DataTextureData'] = 'mapDataTextureData';
    },

	
    mapDataTextureDataModelToThree: function() {
    	var data = new Float32Array(this.get('data'));
    	var width = this.get('width');
    	var height = this.get('height');
    	this.obj.image = { data: data, width: width, height: height };
    	this.obj.needsUpdate = true;
    },

    mapDataTextureDataThreeToModel: function() {
    	var imageRecord = this.obj.image;

		// this.image = { data: data, width: width, height: height };
    	var dataArr = imageRecord.data;
    	var dataWidth = imageRecord.width;
    	var dataHeight = imageRecord.height;

    	this.set('data', this.convertArrayBufferThreeToModel(dataArr));
    	this.set('width', dataWidth);
    	this.set('height', dataHeight);
    },

});

module.exports = {
    DataTextureModel: DataTextureModel,
    DataTextureView: DataTextureView,
};
