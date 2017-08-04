var _ = require('underscore');
var AutogenPlainBufferGeometryModel = require('../geometries/PlainBufferGeometry.autogen').PlainBufferGeometryModel;


var PlainBufferGeometryModel = AutogenPlainBufferGeometryModel.extend({

    createPropertiesArrays: function() {
        AutogenPlainBufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.property_assigners['attributes'] = 'assignAttributesMap';
    },

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

    assignAttributesMap: function(obj, key, value) {

        var three = obj[key];
        var oldKeys = three ? Object.keys(three).sort() : [];
        var newKeys = value ? Object.keys(value).sort() : [];

        var added = _.difference(newKeys, oldKeys);
        var removed = _.difference(oldKeys, newKeys);
        var common = _.intersection(oldKeys, newKeys);

        if (removed.length > 0) {
            console.warn('Cannot remove buffer geometry attributes:', removed);
        }
        added.forEach(key => {
            obj.addAttribute(key, value[key]);
        });

        var current;
        common.forEach(key => {
            current = obj.getAttribute(key);
            if (current !== value[key]) {
                console.warn('Cannot reassign buffer geometry attribute:', key);
                return;  // continue
            }
        });

    },

});

module.exports = {
    PlainBufferGeometryModel: PlainBufferGeometryModel,
};
