var Promise = require('bluebird');
var THREE = require('three');
var InstancedInterleavedBufferAutogen = require('./InstancedInterleavedBuffer.autogen').InstancedInterleavedBufferModel;

var InstancedInterleavedBufferModel = InstancedInterleavedBufferAutogen.extend({

    constructThreeObject: function() {
        var data = this.decodeData();
        var result = new THREE.InstancedInterleavedBuffer(
            data.array,
            data.itemSize,
            this.get('meshPerAttribute')
        );
        result.needsUpdate = true;
        return Promise.resolve(result);

    },

});

module.exports = {
    InstancedInterleavedBufferModel: InstancedInterleavedBufferModel,
};
