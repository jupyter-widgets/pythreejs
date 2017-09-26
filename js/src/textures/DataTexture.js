var _ = require('underscore');
var datawidgets = require('jupyter-datawidgets');
var ndarray = require('ndarray');
var THREE = require('three');
var DataTextureBase = require('./DataTexture.autogen').DataTextureModel;

var DataTextureModel = DataTextureBase.extend({

    createPropertiesArrays: function() {
        DataTextureBase.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['DataTextureData'] = 'mapDataTextureData';
        delete this.property_converters['data'];
    },

    decodeData() {
        var rawData = datawidgets.getArrayFromUnion(this.get('data'));
        if (rawData.dimension < 2 || rawData.dimension > 3) {
            throw Error('DataTexture data dimensions need to be 2 or 3, got:', rawData.dimension)
        }
        var data = this.convertArrayBufferModelToThree(rawData, 'data');

        return {
            data: data,
            width: rawData.shape[0],
            height: rawData.shape[1],
        }
    },

    constructThreeObject: function() {
        var data = this.decodeData();

        // Make a copy of buffer
        var buffer = new data.data.constructor(data.data.length);
        buffer.set(data.data);

        var result = new THREE.DataTexture(
            buffer,
            data.width,
            data.height,
            this.convertEnumModelToThree(this.get('format'), 'format'),
            this.convertEnumModelToThree(this.get('type'), 'type'),
            this.convertEnumModelToThree(this.get('mapping'), 'mapping'),
            this.convertEnumModelToThree(this.get('wrapS'), 'wrapS'),
            this.convertEnumModelToThree(this.get('wrapT'), 'wrapT'),
            this.convertEnumModelToThree(this.get('magFilter'), 'magFilter'),
            this.convertEnumModelToThree(this.get('minFilter'), 'minFilter'),
            this.convertFloatModelToThree(this.get('anisotropy'), 'anisotropy')
        );
        result.needsUpdate = true;
        return Promise.resolve(result);

    },


    mapDataTextureDataModelToThree: function() {
        var imageRecord = this.obj.image;
        var data = this.decodeData();
        if (imageRecord.width !== data.width || imageRecord.height !== imageRecord.height) {
           throw new Error('Cannot change the dimensions of a DataTexture!');
        }
        this.obj.image.data.set(data.data);
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
    },

    mapDataTextureDataThreeToModel: function() {
        var imageRecord = this.obj.image;
        var modelNDArray = this.get('data');
        if (modelNDArray) {
            modelNDArray.data.set(imageRecord.data);
        } else {
            this.set('data', ndarray(imageRecord.data, [imageRecord.width, imageRecord.height]));
        }
    },

}, {
    serializers: _.extend({
        data: datawidgets.data_union_serialization,
    }, DataTextureBase.serializers),
});

module.exports = {
    DataTextureModel: DataTextureModel,
};
