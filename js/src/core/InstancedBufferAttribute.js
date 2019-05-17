var Promise = require('bluebird');
var dataserializers = require('jupyter-dataserializers');
var ndarray = require('ndarray');
var THREE = require('three');
var InstancedBufferAttributeAutogen = require('./InstancedBufferAttribute.autogen').InstancedBufferAttributeModel;

var InstancedBufferAttributeModel = InstancedBufferAttributeAutogen.extend({

    decodeData: function() {
        var rawData = dataserializers.getArray(this.get('array'));
        var itemSize = rawData.dimension === 1 ? 1 : rawData.shape[rawData.dimension - 1];

        var data = this.convertArrayBufferModelToThree(rawData, 'array');
        return {
            array: data,
            itemSize: itemSize,
        };
    },

    constructThreeObject: function() {
        var data = this.decodeData();
        var result = new THREE.InstancedBufferAttribute(
            data.array,
            data.itemSize,
            this.get('normalized'),
            this.get('meshPerAttribute')
        );
        result.needsUpdate = true;
        return Promise.resolve(result);
    },
});

module.exports = {
    InstancedBufferAttributeModel: InstancedBufferAttributeModel,
};
