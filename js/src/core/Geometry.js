var Promise = require('bluebird');
var THREE = require('three');
var AutogenGeometryModel = require('../core/Geometry.autogen').GeometryModel;


var GeometryModel = AutogenGeometryModel.extend({

    constructThreeObject: function() {

        var result = new THREE.Geometry();

        var ref = this.get('_ref_geometry');
        var keep_ref = this.get('_store_ref');
        if (ref) {
            return ref.initPromise.bind(this).then(function() {
                result.copy(ref.obj);

                // A bit of a hack:
                // Sync out all copied properties before restoring
                this.obj = result;
                var old_three = this.props_created_by_three;
                this.props_created_by_three = {};
                [
                    'name', 'colors', 'faces', 'vertices', 'faceVertexUvs', 'morphTargets',
                    'morphNormals', 'skinWeights', 'skinIndices', 'lineDistances',
                ].forEach(function(key) {
                    this.props_created_by_three[key] = true;
                }, this);
                this.syncToModel();
                this.props_created_by_three = old_three;
                if (!keep_ref) {
                    this.set({_ref_geometry: null}, 'pushFromThree');
                    this.save_changes();
                }
                return result;
            });
        }

        return Promise.resolve(result);

    },

});

module.exports = {
    GeometryModel: GeometryModel,
};
