var Promise = require('bluebird');
var dataserializers = require('jupyter-dataserializers');
var ndarray = require('ndarray');
var THREE = require('three');
var DataTexture3DBase = require('./DataTexture3D.autogen').DataTexture3DModel;

class DataTexture3DModel extends DataTexture3DBase {

    createPropertiesArrays() {
        DataTexture3DBase.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['DataTexture3DData'] = 'mapDataTexture3DData';
        delete this.property_converters['data'];
    }

    decodeData() {
        var rawData = dataserializers.getArray(this.get('data'));
        if (rawData.dimension < 2 || rawData.dimension > 3) {
            throw Error('DataTexture3D data dimensions need to be 2 or 3, got:', rawData.dimension);
        }
        var data = this.convertArrayBufferModelToThree(rawData, 'data');

        return {
            data: data,
            width: rawData.shape[0],
            height: rawData.shape[1],
        };
    }

    constructThreeObject() {
        var data = this.decodeData();

        // Make a copy of buffer
        var buffer = new data.data.constructor(data.data.length);
        buffer.set(data.data);

        var result = new THREE.DataTexture3D(
            buffer,
            data.width,
            data.height,
            data.depth
        );
        result.needsUpdate = true;
        return Promise.resolve(result);

    }


    mapDataTexture3DDataModelToThree() {
        var imageRecord = this.obj.image;
        var data = this.decodeData();
        if (imageRecord.width !== data.width ||
            imageRecord.height !== data.height ||
            imageRecord.depth !== data.depth
        ) {
            throw new Error('Cannot change the dimensions of a DataTexture3D!');
        }
        this.obj.image.data.set(data.data);
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
    }

    mapDataTexture3DDataThreeToModel() {
        var imageRecord = this.obj.image;
        var modelNDArray = this.get('data');
        if (modelNDArray) {
            var rawData = dataserializers.getArray(modelNDArray);
            rawData.data.set(imageRecord.data);
        } else {
            this.set('data', ndarray(
                imageRecord.data,
                [imageRecord.width, imageRecord.height, imageRecord.depth]
            ));
        }
    }

}

DataTexture3DModel.serializers = {
    ...DataTexture3DBase.serializers,
    data: dataserializers.data_union_serialization,
};

module.exports = {
    DataTexture3DModel: DataTexture3DModel,
};
