
var widgets = require('@jupyter-widgets/base');
var THREE = require('three');
var _ = require('underscore');


/**
 * Compute the box bounding all objects in a scene graph.
 *
 * Returns an empty if no relevant objects were found.
 */
var computeBoundingBox = function() {
    var objectBoundingBox = new THREE.Box3();

    return function computeBoundingBox(scene) {
        var boundingBox = new THREE.Box3();
        scene.traverseVisible(function (object) {
            if (object.geometry) {
                object.geometry.computeBoundingBox();
                objectBoundingBox.copy(object.geometry.boundingBox);
                object.updateMatrixWorld();
                objectBoundingBox.applyMatrix4(object.matrixWorld);
                boundingBox.union(objectBoundingBox);
            }
        });
        return boundingBox;
    };
}();


/**
 * Compute the sphere bounding all objects in a scene graph.
 *
 * Note: This is based on the bounding spheres of the individual objects
 * in the scene, and not the set of all points in the scene, and will
 * therefore not be optimal.
 *
 * Returns a null if no relevant objects were found.
 */
var computeBoundingSphere = function() {
    var objectBoundingSphere = new THREE.Sphere();
    var vAB = new THREE.Vector3();
    var d, rmin, rmax, rA, rB;
    return function computeBoundingSphere(scene) {
        // Current bounding sphere:
        var boundingSphere = null;
        scene.traverseVisible(function (object) {
            if (object.geometry) {
                object.geometry.computeBoundingSphere();
                if (boundingSphere === null) {
                    // First sphere found, store it
                    boundingSphere = object.geometry.boundingSphere.clone();
                    boundingSphere.applyMatrix4(object.matrixWorld);
                    return;  // continue traverse
                }
                objectBoundingSphere.copy(object.geometry.boundingSphere);
                objectBoundingSphere.applyMatrix4(object.matrixWorld);

                rA = boundingSphere.radius;
                rB = objectBoundingSphere.radius;
                rmin = Math.min(rA, rB);
                rmax = Math.max(rA, rB);

                vAB.subVectors(objectBoundingSphere.center, boundingSphere.center);
                d = vAB.length();
                if (d + rmin < rmax) {
                    // Smallest sphere contained within largest
                    if (rB > rA) {
                        boundingSphere.copy(objectBoundingSphere);
                    }
                    return;  // continue traverse
                }

                // Calculate new bounding-sphere:
                boundingSphere.radius = 0.5 * (rA + rB + d);
                boundingSphere.center.addScaledVector(vAB, 0.5);
            }
        });
        return boundingSphere;
    };
}();




/**
 * Set camera near and far planes close to sphere with given center
 * and radius, assuming the camera is already oriented to look at this
 * sphere.
 *
 * @param {any} camera The camera to adjust
 * @param {any} center The center of the sphere to use as a reference
 * @param {any} radius The radius of the sphere to use as a reference
 * @param {number} [distOffset=0.1] The fraction of the radius to use as padding
 */
function shrinkFrustumPlanes(camera, center, radius, distOffset) {
    distOffset = distOffset === undefined ? 0.1 : distOffset;
    // distOffset = 0.1  -->  10% of radius

    // Find distance from camera to edges of sphere
    var dist = camera.position.distanceTo(center);
    var nearEdge = dist - radius;
    var farEdge = dist + radius;

    // Set near/far sufficiently close to edges of sphere
    camera.near = (1 - distOffset) * nearEdge,
    camera.far = (1 + distOffset) * farEdge;

    // Bound near plane away from zero
    camera.near = Math.max(camera.near, 0.01 * radius);
}

/**
 * Set camera near and far planes with some headroom around sphere
 * with given center and radius, assuming the camera is already
 * oriented to look at this sphere.
 *
 * @param {any} camera The camera to adjust
 * @param {any} center The center of the sphere to use as a reference
 * @param {any} radius The radius of the sphere to use as a reference
 * @param {number} [allowZoom=20] The near/far planes will be adjusted
 *  according to this factor. The far plane distance is multiplied with
 *  this factor, while the near plane is multiplied with its inverse.
 */
function safeFrustumPlanes(camera, center, radius, allowZoom) {
    allowZoom = allowZoom === undefined ? 20 : allowZoom;
    // Find distance from camera to edges of sphere
    var dist = camera.position.distanceTo(center);
    var nearEdge = dist - radius;
    var farEdge = dist + radius;

    // Set near/far sufficiently far from edge of sphere to allow some zooming
    camera.near = (1 / allowZoom) * nearEdge;
    camera.far = allowZoom * farEdge;

    // Bound near plane away from zero
    camera.near = Math.max(camera.near, 0.001 * radius);
}

/**
 * Set the camera to look at a sphere, additionally moving the camera
 * closer/further to ensure that the sphere fills the camera FOV. The
 * actual FOV value is left untouched. Additionaly it can adjust the
 * camera's near/far planes to fit the sphere as well (enabled by
 * default).
 *
 * @param {any} camera The camera to adjust
 * @param {any} center The center of the sphere to use as a reference
 * @param {any} radius The radius of the sphere to use as a reference
 * @param {any} [setNearFar='safe'] Whether, and how, to update camera
 *   near/far planes. 'safe' sets the planes a reasonable distance around
 *   the sphere; 'tight' sets them close (but not touching) the sphere;
 *   and a falsy value will leave the near/far planes untouched.
 */
function lookAtSphere(camera, center, radius, setNearFar) {
    setNearFar = setNearFar === undefined ? 'safe' : setNearFar;
    if (!camera.isPerspectiveCamera) {
        console.error('Expecting a perspective camera.');
    }

    // Compute distance based on FOV
    var radScale = 1.5;  // Include this much more than the sphere
    var distance = (radScale * radius) / Math.tan(0.5 * camera.fov * Math.PI / 180);

    // Place camera such that the model is in the -z direction from the camera
    camera.position.setX(center.x);
    camera.position.setY(center.y);
    camera.position.setZ(center.z + distance);

    // Look at scene center
    camera.lookAt(center.clone());

    if (setNearFar === 'tight') {
        // Set near and far planes to include sphere with a narrow margin
        shrinkFrustumPlanes(camera, center, radius);
    } else if (setNearFar === 'safe') {
        // Set near and far planes to include sphere with a wide margin for zooming
        safeFrustumPlanes(camera, center, radius);
    } else if (setNearFar) {
        // If setNearFar is a non-valid, truthy value, it is invalid
        throw new Error('setNearFar argument to lookAtSphere invalid: ' + setNearFar);
    }

    // Update matrix
    camera.updateProjectionMatrix();
}


/**
 * Create a new model from the JS side.
 *
 * This will be pushed to the python side.
 */
function createModel(constructor, widget_manager, obj) {

    var id = widgets.uuid();

    var modelOptions = {
        widget_manager: widget_manager,
        model_id: id,
        three_obj: obj,
    };
    var attributes = { };
    var widget_model = new constructor(attributes, modelOptions);
    widget_model.name = constructor.model_name;
    widget_model.module = constructor.model_module;

    var modelPromise = widget_model.initPromise.then(function() {
        var split = widgets.remove_buffers(
            widget_model.serialize(widget_model.get_state(true)));
        var data = {
            state: _.extend({}, split.state, {
                _model_name: constructor.model_name,
                _model_module: constructor.model_module,
                _model_module_version: constructor.model_module_version,
                _view_name: null,
                _view_module: null,
                _view_module_version: '',
            }),
            buffer_paths: split.buffer_paths
        };
        var buffers = split.buffers;
        var metadata = {version: widgets.PROTOCOL_VERSION};

        // Create un-opened comm:
        return widget_manager._create_comm(
            widget_manager.comm_target_name, id, data, metadata, buffers);
    }).then(function(comm) {

        widget_model.comm = comm;

        // Hook comm messages up to model.
        comm.on_close(_.bind(widget_model._handle_comm_closed, widget_model));
        comm.on_msg(_.bind(widget_model._handle_comm_msg, widget_model));

        widget_model.comm_live = true;

        return widget_model;
    });
    widget_manager.register_model(id, modelPromise);

    return modelPromise;
}


/**
 * Gets the child models of an arbitrarily nested combination of
 * arrays and dicts (hash maps).
 *
 * @param {any} obj nested array/dict structure with WidgetModels as leaf nodes.
 * @returns The child models
 */
function childModelsNested(obj) {
    var children;
    if (Array.isArray(obj)) {
        children = obj;
    } else {
        children = Object.keys(obj).map(function(childModelKey) {
            return obj[childModelKey];
        });
    }
    if (children.length === 0) {
        return children;
    }
    if (children[0] instanceof widgets.WidgetModel) {
        // Bottom level (children are leaf nodes)
        return children;
    }
    return _.flatten(children.map(function(child) {
        return childModelsNested(child);
    }), true);
}


/**
 * Get the diff of two array.
 *
 * @param {any[]} newArray
 * @param {any[]} oldArray
 * @returns An object with three attributes 'added', 'removed' and 'kept',
 *          each an array of child values;
 */
function arrayDiff(newArray, oldArray) {
    var added = _.difference(newArray, oldArray);
    var removed = _.difference(oldArray, newArray);
    var kept = _.intersection(oldArray, newArray);
    return {added: added, removed: removed, kept: kept};
}

/**
 * Get the diff of two dicts (hash maps).
 *
 * @param {any} newDict
 * @param {any} oldDict
 * @returns An object with three attributes 'added', 'removed' and 'kept',
 *          each an array of child values;
 */
function dictDiff(newDict, oldDict) {
    var newKeys = Object.keys(newDict);
    var oldKeys = Object.keys(oldDict);

    var added = _.difference(newKeys, oldKeys).map(function(key) { return newDict[key]; });
    var removed = _.difference(oldKeys, newKeys).map(function(key) { return oldDict[key]; });
    var kept = _.intersection(newKeys, oldKeys).map(function(key) { return newDict[key]; });
    return {added: added, removed: removed, kept: kept};
}

/**
 * Get the diff of two arbitrarily nested combinations of
 * arrays and dicts (hash maps).
 *
 * Note: This function assumes the structure of both are the same,
 * i.e. they both have the same type at the same nesting level.
 *
 * @param {any | any[]} newObj
 * @param {any | any[]} oldObj
 * @returns An object with three attributes 'added', 'removed' and 'kept',
 *          each an array of child models;
 */
function nestedDiff(newObj, oldObj) {
    var diff;
    if (Array.isArray(newObj)) {
        diff = arrayDiff(newObj, oldObj);
    } else {
        diff = dictDiff(newObj, oldObj);
    }
    var all = [...diff.added, ...diff.removed, ...diff.kept];
    if (all.length === 0) {
        return all;
    }
    if (all[0] instanceof widgets.WidgetModel) {
        // Bottom level
        return diff;
    }
    var ret = {
        added: childModelsNested(diff.added),
        removed: childModelsNested(diff.removed),
    };
    return ret;
}

/**
 * Get the scene object of an Object3D.
 *
 * @param {THREE.Object3D} object3d
 * @returns The scene object, or null if it cannot be found
 */
function getObjectScene(object3d) {
    while (object3d.parent) {
        object3d = object3d.parent;
    }
    if (object3d.type === 'Scene') {
        return object3d;
    }
    return null;
}

/**
 * Get the scene model for a three Object3D model.
 *
 * @param {any} model
 * @returns The scene object's model, or null if it cannot be found
 */
function getModelScene(model) {
    var obj = model.obj;
    while (obj.parent) {
        obj = obj.parent;
    }
    if (obj.type === 'Scene') {
        return obj.ipymodel;
    }
    return null;
}


var threeReverseLut;
var customModelsLut = {};

/**
 * Fund the unminified name of the constructor of a three object.
 */
function lookupThreeConstructorName(obj) {
    var name = obj.constructor.name;
    if (THREE[name] !== undefined) {
        return name;
    }
    // Check against our custom classes:
    if (customModelsLut[name] !== undefined) {
        return customModelsLut[name];
    }

    // Assume constructor name is minified, try a reverse lookup
    if (!threeReverseLut) {
        // Build reverse LUT and store it
        threeReverseLut = Object.keys(THREE).reduce(function(res, key) {
            var value = THREE[key];
            if (!!value.prototype && !!value.prototype.constructor.name) {
                res[value.prototype.constructor.name] = key;
            }
            return res;
        }, {});
    }
    return threeReverseLut[name];
}


module.exports = {
    createModel: createModel,
    computeBoundingSphere: computeBoundingSphere,
    computeBoundingBox: computeBoundingBox,
    customModelsLut: customModelsLut,
    shrinkFrustumPlanes: shrinkFrustumPlanes,
    safeFrustumPlanes: safeFrustumPlanes,
    lookAtSphere: lookAtSphere,
    childModelsNested: childModelsNested,
    arrayDiff: arrayDiff,
    dictDiff: dictDiff,
    nestedDiff: nestedDiff,
    getObjectScene: getObjectScene,
    getModelScene: getModelScene,
    lookupThreeConstructorName: lookupThreeConstructorName,
};
