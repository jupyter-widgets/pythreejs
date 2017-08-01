var AutogenPlainBufferGeometryModel = require('../geometries/PlainBufferGeometry.autogen').PlainBufferGeometryModel;


var PlainBufferGeometryModel = AutogenPlainBufferGeometryModel.extend({

    constructThreeObject: function() {

        var result = new THREE.BufferGeometry();

        var ref = this.get('_ref_geometry');
        if (ref) {
            return ref.initPromise.bind(this).then(function() {
                result.copy(ref.obj);

                // A bit of a hack:
                // Sync out all copied properties before restoring
                this.obj = result;
                var old_three = this.props_created_by_three;
                this.props_created_by_three = {};
                [
                    'name', 'attributes', 'morphAttributes',
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
    PlainBufferGeometryModel: PlainBufferGeometryModel,
};
