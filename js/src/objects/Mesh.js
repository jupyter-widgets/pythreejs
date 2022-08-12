var MeshAutogen = require('./Mesh.autogen').MeshModel;


var optionalArraySerializer = {
    serialize(value, manager) {
        if (value === undefined) {
            return [];
        }
    }
};

class MeshModel extends MeshAutogen {
}


MeshModel.serializers = {
    ...MeshAutogen.serializers,
    morphTargetInfluences: optionalArraySerializer,
};

module.exports = {
    MeshModel: MeshModel,
};
