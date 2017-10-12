var _ = require('underscore');
var SkinnedMeshAutogen = require('./SkinnedMesh.autogen').SkinnedMeshModel;

var SkinnedMeshModel = SkinnedMeshAutogen.extend({

    createPropertiesArrays: function() {

        SkinnedMeshAutogen.prototype.createPropertiesArrays.call(this);
        this.property_assigners['skeleton'] = 'assignSkeleton';
    },

    assignSkeleton: function(obj, key, value) {
        if (value) {
            obj.bind(value);
            obj.scale.multiplyScalar(1);
        }
    }

});

module.exports = {
    SkinnedMeshModel: SkinnedMeshModel,
};
