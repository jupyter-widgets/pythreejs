var _ = require('underscore');
var Object3DAutogen = require('./Object3D.autogen').Object3DModel;

class Object3DModel extends Object3DAutogen {

    createPropertiesArrays() {
        Object3DAutogen.prototype.createPropertiesArrays.call(this);

        this.property_assigners['children'] = 'assignChildren';

        _.each(['position', 'quaternion', 'rotation', 'scale'], function(key) {
            delete this.property_converters[key];
            delete this.property_assigners[key];
        }, this);
    }

    assignChildren(obj, key, value) {
        var old = obj[key];
        var removed = _.difference(old, value);
        var added = _.difference(value, old);
        if (removed.length > 0) {
            obj.remove.apply(obj, removed);
        }
        if (added.length > 0) {
            obj.add.apply(obj, added);
        }
    }

    syncToThreeObj(force) {
        var matrixChanged;
        if (force) {
            matrixChanged = !_.isEqual(this.obj.matrix.elements, this.get('matrix'));
        } else {
            matrixChanged = this.hasChanged('matrix');
        }
        var changedDeps = this.changedDeps(force);
        if (changedDeps.length > 0) {
            if (changedDeps.indexOf('rotation') !== -1 &&
                    changedDeps.indexOf('quaternion') !== -1) {
                // Remove rotation if quaternion is alos included
                changedDeps.splice(changedDeps.indexOf('rotation'), 1);
            }
            this.syncMatrixDependentsToThree(changedDeps);
        }
        Object3DAutogen.prototype.syncToThreeObj.call(this, force);
        if (matrixChanged || changedDeps.length > 0) {
            this.obj.matrixWorldNeedsUpdate = true;
            // Sync back anything that changed, incl matrix
            // unless that also changed
            this.syncMatrixDependentsToModel(!matrixChanged);
            this.save_changes();
        }
    }

    syncToModel(syncAllProps) {
        if (syncAllProps) {
            this.syncMatrixDependentsToModel(true);
        }
        Object3DAutogen.prototype.syncToModel.call(this, syncAllProps);
    }

    changedDeps(force) {
        return _.filter(['position', 'quaternion', 'rotation', 'scale'], function(key) {
            if (force) {
                return !_.isEqual(this.obj[key].toArray(), this.get(key));
            }
            return this.hasChanged(key);
        }, this);
    }

    syncMatrixDependentsToThree(changedDeps) {
        if (changedDeps.indexOf('rotation') !== -1) {
            this.assignEuler(this.obj, 'rotation',
                this.convertEulerModelToThree(this.get('rotation'), 'rotation')
            );
        }
        _.each(['position', 'quaternion', 'scale'], function(key) {
            if (changedDeps.indexOf(key) === -1) {
                // Skip unchanged properties
                return;
            }
            this.assignVector(this.obj, key,
                this.convertVectorModelToThree(this.get(key), key)
            );
        }, this);
    }

    syncMatrixDependentsToModel(includeMatrix) {
        var toSet = {
            position: this.convertVectorThreeToModel(this.obj.position, 'position'),
            quaternion: this.convertVectorThreeToModel(this.obj.quaternion, 'quaternion'),
            scale: this.convertVectorThreeToModel(this.obj.scale, 'scale'),
            rotation: this.convertEulerThreeToModel(this.obj.rotation, 'rotation'),
        };
        if (includeMatrix) {
            this.obj.updateMatrix();
            this.obj.updateMatrixWorld();
            _.each(['matrix', 'matrixWorldNeedsUpdate'], function(key) {
                var converterName = this.property_converters[key] + 'ThreeToModel';
                var converterFn = this[converterName];
                toSet[key] = converterFn.bind(this)(this.obj[key], key);
            }, this);
        }
        this.set(toSet, 'pushFromThree');
    }

}

module.exports = {
    Object3DModel: Object3DModel,
};
