var AutogenPlainGeometryModel = require('../geometries/PlainGeometry').PlainGeometryModel;


var PlainGeometryModel = AutogenPlainGeometryModel.extend({

    constructThreeObject: function() {

        var result = new THREE.Geometry();

        var ref = this.get('_ref_geometry');
        if (ref) {
            return ref.initPromise.bind(this).then(function() {
                result.copy(ref.obj);

                // A bit of a hack:
                // Sync out all copied properties before returning
                this.obj = result;
                var old_three = this.props_created_by_three;
                this.props_created_by_three = {};
                [
                    'name', 'colors', 'faces', 'vertices', 'faceVertexUvs', 'morphTargets',
                    'morphNormals', 'skinWeights', 'skinIndices', 'lineDistances',
                    'boundingBox', 'boundingSphere'
                ].forEach(key => {
                    this.props_created_by_three[key] = true;
                });
                this.syncToModel();
                this.props_created_by_three = old_three;
                return result;
            });
        }

        return Promise.resolve(result);

    },

});

module.exports = {
    PlainGeometryModel: PlainGeometryModel,
};
