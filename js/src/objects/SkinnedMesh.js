var SkinnedMeshAutogen = require('./SkinnedMesh.autogen').SkinnedMeshModel;

class SkinnedMeshModel extends SkinnedMeshAutogen {

    createPropertiesArrays() {

        SkinnedMeshAutogen.prototype.createPropertiesArrays.call(this);
        this.property_assigners['skeleton'] = 'assignSkeleton';
    }

    assignSkeleton(obj, key, value) {
        if (value) {
            obj.bind(value);
            obj.scale.multiplyScalar(1);
        }
    }

}

module.exports = {
    SkinnedMeshModel: SkinnedMeshModel,
};
