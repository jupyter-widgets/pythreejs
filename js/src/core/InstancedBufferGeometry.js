var InstancedBufferGeometryAutogen = require('./InstancedBufferGeometry.autogen').InstancedBufferGeometryModel;

var InstancedBufferGeometryModel = InstancedBufferGeometryAutogen.extend({

    createPropertiesArrays: function() {

        InstancedBufferGeometryAutogen.prototype.createPropertiesArrays.call(this);

        this.property_converters['maxInstancedCount'] = 'convertNullToUndefined';

    },

    convertNullToUndefinedModelToThree: function(v) {
        if (v === null) {
            return undefined;
        }
        return v;
    },

    convertNullToUndefinedThreeToModel: function(v) {
        if (v === undefined) {
            return null;
        }
        return v;
    },

});

module.exports = {
    InstancedBufferGeometryModel: InstancedBufferGeometryModel,
};
