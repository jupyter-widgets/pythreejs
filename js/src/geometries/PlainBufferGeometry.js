var _ = require('underscore');
var THREE = require('three');
var createModel = require('../_base/utils').createModel;

var AutogenPlainBufferGeometryModel = require('../geometries/PlainBufferGeometry.autogen').PlainBufferGeometryModel;

var BufferAttributeModel = require('../core/BufferAttribute.js').BufferAttributeModel;
var InterleavedBufferAttributeModel = require('../core/InterleavedBufferAttribute.autogen.js').InterleavedBufferAttributeModel;
var GeometryModel = require('../core/Geometry.autogen.js').GeometryModel;
var BufferGeometryModel = require('../core/BufferGeometry.autogen.js').BufferGeometryModel;


var PlainBufferGeometryModel = AutogenPlainBufferGeometryModel.extend({

    createPropertiesArrays: function() {
        AutogenPlainBufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.property_assigners['attributes'] = 'assignAttributesMap';
    },

    constructFromRef: function(ref) {
        var result = new THREE.BufferGeometry();

        var chain = ref.initPromise.bind(this);
        var toSet = {};
        if (ref instanceof PlainBufferGeometryModel) {
            // Ensure ref three obj attributes are actually created:
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
            );
        }

        // Create three.js BufferAttributes from ref.
        if (ref instanceof BufferGeometryModel) {
            chain = chain.then(function() {
                // Copy ref. This will create new buffers!
                result.copy(ref.obj);
            });
        } else if (ref instanceof GeometryModel) {
            // Copy from geometry. This will create new buffers.
            chain = chain.then(function() {
                result.fromGeometry(ref.obj);
            });
        } else {
            throw new Error('Invalid reference geometry:', ref);
        }

        // Result now has all the attributes, but they do not
        // currently have corresponding pythreejs models.
        // We need to:
        // - Create models for each buffer attribute
        // - Set attribute dicts on model
        return chain.then(() => {
        // Create models for all attributes:
            return Promise.all(_.map(_.pairs(result.attributes), kv => {
                var modelCtor = kv[1].isInterleavedBufferAttribute ? InterleavedBufferAttributeModel : BufferAttributeModel;
                return createModel(modelCtor, this.widget_manager, kv[1]).then(model => {
                    return [kv[0], model];
                });
            }));
        }).then((attribModelKVs) => {
            toSet.attributes = _.object(attribModelKVs);

        // Then create models for all morphAttributes:
        }).then(Promise.all(_.map(_.pairs(result.morphAttributes), kv => {
            var modelCtor = kv[1].isInterleavedBufferAttribute ? InterleavedBufferAttributeModel : BufferAttributeModel;
            return createModel(modelCtor, this.widget_manager, kv[1]).then(model => {
                return [kv[0], model];
            });
        }))).then((attribModelKVs) => {
            toSet.morphAttributes = _.object(attribModelKVs);

        // Sync out all properties that have been set:
        }).then(() => {
            // Add other fields that needs to be synced out:
            toSet.name = result.name;

            // Perform actual sync to kernel side:
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
            if (key === 'index') {
                obj.setIndex(value[key]);
            } else {
                obj.addAttribute(key, value[key]);
            }
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
