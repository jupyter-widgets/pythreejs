var InstancedBufferGeometryAutogen = require('./InstancedBufferGeometry.autogen').InstancedBufferGeometryModel;

class InstancedBufferGeometryModel extends InstancedBufferGeometryAutogen {

    createPropertiesArrays() {

        InstancedBufferGeometryAutogen.prototype.createPropertiesArrays.call(this);

        this.property_converters['maxInstancedCount'] = 'convertNullToUndefined';

    }

    convertNullToUndefinedModelToThree(v) {
        if (v === null) {
            return undefined;
        }
        return v;
    }

    convertNullToUndefinedThreeToModel(v) {
        if (v === undefined) {
            return null;
        }
        return v;
    }

}

module.exports = {
    InstancedBufferGeometryModel: InstancedBufferGeometryModel,
};
