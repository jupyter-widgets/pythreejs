var _ = require('underscore');
var MeshAutogen = require('./Mesh.autogen').MeshModel;


var optionalArraySerializer = {
    serialize: function(value, manager) {
        if (value === undefined) {
            return [];
        }
    }
};

var MeshModel = MeshAutogen.extend({
}, {
    serializers: _.extend({
        morphTargetInfluences: optionalArraySerializer,
    },  MeshAutogen.serializers),
});

module.exports = {
    MeshModel: MeshModel,
};
