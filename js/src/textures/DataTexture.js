var Promise = require('bluebird');
var dataserializers = require('jupyter-dataserializers');
var ndarray = require('ndarray');
var THREE = require('three');
var DataTextureBase = require('./DataTexture.autogen').DataTextureModel;

class DataTextureModel extends DataTextureBase {

    createPropertiesArrays() {
        DataTextureBase.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['DataTextureData'] = 'mapDataTextureData';
        delete this.property_converters['data'];
    }

    decodeData() {
        var rawData = dataserializers.getArray(this.get('data'));
        if (rawData.dimension < 2 || rawData.dimension > 3) {
            throw Error('DataTexture data dimensions need to be 2 or 3, got:', rawData.dimension);
        }
        var data = this.convertArrayBufferModelToThree(rawData, 'data');

        // ipydatawidgets uses row-major storage, so "flip" axes dims here:
        return {
            data: data,
            width: rawData.shape[1],
            height: rawData.shape[0],
        };
    }

    constructThreeObject() {
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

    }


    mapDataTextureDataModelToThree() {
        var imageRecord = this.obj.image;
        var data = this.decodeData();
        if (imageRecord.width !== data.width ||
            imageRecord.height !== data.height
        ) {
            throw new Error('Cannot change the dimensions of a DataTexture!');
        }
        this.obj.image.data.set(data.data);
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
    }

    mapDataTextureDataThreeToModel() {
        var imageRecord = this.obj.image;
        var modelNDArray = this.get('data');
        if (modelNDArray) {
            var rawData = dataserializers.getArray(modelNDArray);
            rawData.data.set(imageRecord.data);
        } else {
            // ipydatawidgets uses row-major storage, so "flip" axes dims here:
            this.set('data', ndarray(
                imageRecord.data,
                [imageRecord.height, imageRecord.width]
            ));
        }
    }

}


DataTextureModel.serializers = {
    ...DataTextureBase.serializers,
    data: dataserializers.data_union_serialization,
};

module.exports = {
    DataTextureModel: DataTextureModel,
};
