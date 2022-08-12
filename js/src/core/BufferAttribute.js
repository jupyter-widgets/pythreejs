var Promise = require('bluebird');
var dataserializers = require('jupyter-dataserializers');
var ndarray = require('ndarray');
var THREE = require('three');
var BufferAttributeAutogen = require('./BufferAttribute.autogen').BufferAttributeModel;

class BufferAttributeModel extends BufferAttributeAutogen {

    createPropertiesArrays() {
        BufferAttributeAutogen.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['BufferAttributeArray'] = 'mapBufferAttributeArray';
        delete this.property_converters['array'];
    }

    decodeData() {
        var rawData = dataserializers.getArray(this.get('array'));
        var itemSize = rawData.dimension === 1 ? 1 : rawData.shape[rawData.dimension - 1];

        var data = this.convertArrayBufferModelToThree(rawData, 'array');
        return {
            array: data,
            itemSize: itemSize,
        };
    }

    constructThreeObject() {
        var data = this.decodeData();
        var result = new THREE.BufferAttribute(
            data.array,
            data.itemSize,
            this.get('normalized')
        );
        result.needsUpdate = true;
        return Promise.resolve(result);

    }

    mapBufferAttributeArrayModelToThree() {
        var data = this.decodeData();
        this.obj.setArray(data.array);
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
    }

    mapBufferAttributeArrayThreeToModel() {
        /*
         * There are a few different cases to take into account here:
         * 1. We are during initial setup of a normal creation, with a widget ref
         * 2. We are during initial setup of a normal creation, with an array
         * 3. We are during initial setup from an existing three obj (nothing in model yet)
         * 4. We are syncing something back (e.g. after change event), possibly this data.
         *    The model should already have something defined then (possibly null).
         */
        var attributeData = this.obj.array;
        var modelNDArray = this.get('array');
        if (modelNDArray) {
            // 1. / 2.
            var rawData = dataserializers.getArray(modelNDArray);
            rawData.data.set(attributeData);
        } else {
            // 3. / 4.
            this.set('array', ndarray(attributeData, [this.obj.count, this.obj.itemSize]));
        }
    }

    onChildChanged(model) {
        if (model === this.get('array')) {
            // We need to update data
            this.mapBufferAttributeArrayModelToThree();
        }
    }

}

module.exports = {
    BufferAttributeModel: BufferAttributeModel,
};
