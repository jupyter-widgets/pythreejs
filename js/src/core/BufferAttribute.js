var _ = require('underscore');
var datawidgets = require('jupyter-datawidgets');
var ndarray = require('ndarray');
var BufferAttributeAutogen = require('./BufferAttribute.autogen').BufferAttributeModel;

var BufferAttributeModel = BufferAttributeAutogen.extend({

    createPropertiesArrays: function() {
        BufferAttributeAutogen.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['BufferAttributeArray'] = 'mapBufferAttributeArray';
        delete this.property_converters['array'];
    },

    decodeData() {
        var rawData = this.get('array');
        if (rawData.dimension > 2) {
            throw Error('Array has too many dimensions:', array)
        }
        var itemSize = rawData.dimension === 1 ? 1 : rawData.shape[1];

        var data = this.convertArrayBufferModelToThree(rawData, 'array');
        return {
            array: data,
            itemSize: itemSize,
        }
    },

    constructThreeObject: function() {
        var data = this.decodeData();
        var result = new THREE.BufferAttribute(
            data.array,
            data.itemSize,
            this.get('normalized')
        );
        result.needsUpdate = true;
        return Promise.resolve(result);

    },

    mapBufferAttributeArrayModelToThree: function() {
        var data = this.decodeData();
        this.obj.setArray(data.array);
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
    },

    mapBufferAttributeArrayThreeToModel: function() {
        var attributeData = this.obj.array;
        var modelNDArray = this.get('array');
        if (modelNDArray) {
            modelNDArray.data.set(attributeData);
        } else {
            this.set('array', ndarray(attributeData, [this.obj.count, this.obj.itemSize]));
        }
    },

}, {
    serializers: _.extend({
        array: datawidgets.array_serialization,
    }, BufferAttributeAutogen.serializers),
});

module.exports = {
    BufferAttributeModel: BufferAttributeModel,
};
