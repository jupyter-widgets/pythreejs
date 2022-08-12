var _ = require('underscore');
var Promise = require('bluebird');
var THREE = require('three');
var createModel = require('../_base/utils').createModel;

var AutogenBufferGeometryModel = require('../core/BufferGeometry.autogen').BufferGeometryModel;

var BufferAttributeModel = require('../core/BufferAttribute.js').BufferAttributeModel;
var InterleavedBufferAttributeModel = require('../core/InterleavedBufferAttribute.autogen.js').InterleavedBufferAttributeModel;
var BaseGeometryModel = require('../core/BaseGeometry.autogen.js').BaseGeometryModel;
var BaseBufferGeometryModel = require('../core/BaseBufferGeometry.autogen.js').BaseBufferGeometryModel;


class BufferGeometryModel extends AutogenBufferGeometryModel {

    createPropertiesArrays() {
        AutogenBufferGeometryModel.prototype.createPropertiesArrays.call(this);
        this.property_assigners['attributes'] = 'assignAttributesMap';
    }

    constructFromRef(ref, keep_ref) {
        var result = new THREE.BufferGeometry();

        var chain = ref.initPromise.bind(this);
        var toSet = {};
        if (ref instanceof BufferGeometryModel) {
            // Ensure ref three obj attributes are actually created:
            chain = chain.then(
                // Wait for all attributes
                Promise.all(_.map(_.values(ref.get('attributes')), function(attr) {
                    return attr.initPromise;
                }))
            ).then(
                // Wait for all morphAttributes
                Promise.all(_.map(_.values(ref.get('morphAttributes')), function(attr) {
                    return attr.initPromise;
                }))
            ).then(function() {
                // Wait for index attribute
                return ref.get('index').then(function(index) {
                    return index.initPromise;
                });
            });
        }

        // Create three.js BufferAttributes from ref.
        if (ref instanceof BaseBufferGeometryModel) {
            chain = chain.then(function() {
                // Copy ref. This will create new buffers!
                result.copy(ref.obj);
            });
        } else if (ref instanceof BaseGeometryModel) {
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
        return chain.then(function() {
        // Create models for all attributes:
            return Promise.all(_.map(_.pairs(result.attributes), function(kv) {
                var modelCtor = kv[1].isInterleavedBufferAttribute ? InterleavedBufferAttributeModel : BufferAttributeModel;
                return createModel(modelCtor, this.widget_manager, kv[1]).then(function(model) {
                    return [kv[0], model];
                });
            }, this));
        }).then(function(attribModelKVs) {
            toSet.attributes = _.object(attribModelKVs);

        // Then create models for all morphAttributes:
        }).then(function() {
            return Promise.all(_.map(_.pairs(result.morphAttributes), function(kv) {
                var modelCtor = kv[1].isInterleavedBufferAttribute ? InterleavedBufferAttributeModel : BufferAttributeModel;
                return createModel(modelCtor, this.widget_manager, kv[1]).then(function(model) {
                    return [kv[0], model];
                }, this);
            }));
        }).then(function(attribModelKVs) {
            toSet.morphAttributes = _.object(attribModelKVs);

        // Then create models for index attribute:
        }).then(function() {
            if (result.index) {
                var modelCtor = result.index.isInterleavedBufferAttribute ? InterleavedBufferAttributeModel : BufferAttributeModel;
                return createModel(modelCtor, this.widget_manager, result.index).then(function(model) {
                    toSet.index = model;
                }, this);
            }

        // Sync out all properties that have been set:
        }).then(function() {
            // Add other fields that needs to be synced out:
            toSet.name = result.name;
            // Discard ref unless told to keep it:
            if (!keep_ref) {
                toSet._ref_geometry = null;
            }

            // Perform actual sync to kernel side:
            this.set(toSet, 'pushFromThree');
            this.save_changes();

            return result;
        });
    }

    constructThreeObject() {
        var ref = this.get('_ref_geometry');
        var keep_ref = this.get('_store_ref');
        if (ref) {
            return this.constructFromRef(ref, keep_ref);
        }

        var result = new THREE.BufferGeometry();
        return Promise.resolve(result);
    }

    assignAttributesMap(obj, key, value) {

        var three = obj[key];
        var oldKeys = three ? Object.keys(three).sort() : [];
        var newKeys = value ? Object.keys(value).sort() : [];

        var added = _.difference(newKeys, oldKeys);
        var removed = _.difference(oldKeys, newKeys);
        var common = _.intersection(oldKeys, newKeys);

        if (removed.length > 0) {
            console.warn('Cannot remove buffer geometry attributes:', removed);
        }
        added.forEach(function(key) {
            if (key === 'index') {
                obj.setIndex(value[key]);
            } else {
                obj.addAttribute(key, value[key]);
            }
        });

        var commonChanged = _.filter(common, function(key) {
            return obj.getAttribute(key) !== value[key];
        });
        if (commonChanged.length > 0) {
            console.warn('Cannot reassign buffer geometry attribute:', commonChanged);
        }

    }

}

module.exports = {
    BufferGeometryModel: BufferGeometryModel,
};
