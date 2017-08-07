var _ = require('underscore');
var createModel = require('../_base/utils').createModel;

var AutogenPlainBufferGeometryModel = require('../geometries/PlainBufferGeometry.autogen').PlainBufferGeometryModel;

var core = require('../core')
var BufferGeometryModel = core.BufferGeometryModel;
var BufferAttributeModel = core.BufferAttributeModel;


var PlainBufferGeometryModel = AutogenPlainBufferGeometryModel.extend({

    createPropertiesArrays: function() {
        AutogenPlainBufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.property_assigners['attributes'] = 'assignAttributesMap';
    },

    constructFromRef: function(ref) {
        var result = new THREE.BufferGeometry();
        // Copy ref. This will create new buffers!
        result.copy(ref.obj);

        var chain = ref.initPromise.bind(this);
        var toSet = {};
        if (ref instanceof PlainBufferGeometryModel) {
            // TODO: Review this!
            chain = chain.then(
                // Wait for all attributes
                Promise.all(_.map(_.values(ref.get('attributes')), attr => {
                    return attr.initPromise;
                }))
            ).then(
                // Wait for all morphAttributes
                Promise.all(_.map(_.values(ref.get('morphAttributes')), attr => {
                    return attr.initPromise;
                }))
            ).then(() => {
                // Copy ref. This will create new buffers!
                result.copy(ref.obj);
            });
        } else if (ref instanceof BufferGeometryModel) {
            // We have a ref that is some other kind of buffergeometry
            // This ref will then not have 'attributes' as models
            // We need to:
            // - Create models for each bufferattribute
            // - Set attribute dicts on model
            // Create models for all attributes:
            chain = chain.then(function() {
                // Copy ref. This will create new buffers!
                result.copy(ref.obj);

                return Promise.all(_.map(_.pairs(result.attributes), kv => {
                    return createModel(BufferAttributeModel, this.widget_manager, kv[1]).then(model => {
                        return [kv[0], model];
                    });
                }));
            }).then((attribModelKVs) => {
                toSet.attributes = _.object(attribModelKVs);

            // Then create models for all morphAttributes:
            }).then(Promise.all(_.map(_.pairs(result.morphAttributes), kv => {
                return createModel(BufferAttributeModel, this.widget_manager, kv[1]).then(model => {
                    return [kv[0], model];
                });
            }))).then((attribModelKVs) => {
                toSet.morphAttributes = _.object(attribModelKVs);
            });
        } else {
            // Assume ref is GeometryModel
            throw new Error('Geometry -> PlainBufferGeometry not yet supported!');
        }

        return chain.then(function() {

            // Sync out all copied properties not yet dealt with
            toSet.name = result.name;
            this.set(toSet, 'pushFromThree');
            this.save_changes();

            return result;
        });
    },

    constructThreeObject: function() {
        var ref = this.get('_ref_geometry');
        if (ref) {
            return this.constructFromRef(ref);
        }

        var result = new THREE.BufferGeometry();
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

        var commonChanged = _.filter(common, key => { return obj.getAttribute(key) !== value[key]});
        if (commonChanged.length > 0) {
            console.warn('Cannot reassign buffer geometry attribute:', commonChanged);
        }

    },

});

module.exports = {
    PlainBufferGeometryModel: PlainBufferGeometryModel,
};
