var _ = require('underscore');
var datawidgets = require('jupyter-datawidgets');
var BufferAttributeAutogen = require('./BufferAttribute.autogen').BufferAttributeModel;

var BufferAttributeModel = BufferAttributeAutogen.extend({

    constructThreeObject: function() {

        var array = this.get('array');
        if (array.dimension > 2) {
            throw Error('Array has too many dimensions:', array)
        }
        var itemSize = array.dimension === 1 ? 1 : array.shape[1];

        var result = new THREE.BufferAttribute(
            this.convertArrayBufferModelToThree(array, 'array'),
            itemSize,
            this.get('normalized')
        );
        return Promise.resolve(result);

    },

    assignAttributeMap: function() {

    },

}, {
    serializers: _.extend({
        array: datawidgets.array_serialization,
    }, BufferAttributeAutogen.serializers),
});

module.exports = {
    BufferAttributeModel: BufferAttributeModel,
};
