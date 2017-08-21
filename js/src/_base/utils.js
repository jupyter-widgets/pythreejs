
var widgets = require("@jupyter-widgets/base");
var THREE = require('three');


/**
 * Compute the box bounding all objects in a scene graph.
 *
 * Returns a unity box if no relevant objects were found.
 */
var computeBoundingBox = function() {
    var objectBoundingBox = new THREE.Box3();

    return function computeBoundingBox(scene) {
        var boundingBox = new THREE.Box3();
        scene.traverseVisible(function (object) {
            if (object.geometry) {
                object.geometry.computeBoundingBox();
                objectBoundingBox.copy(object.geometry.boundingBox);
                objectBoundingBox.applyMatrix4(object.matrixWorld);
                boundingBox.union(objectBoundingBox);
            }
        });
        if (boundingBox.isEmpty()) {
            boundingBox.min.set(-1, -1, -1);
            boundingBox.max.set(1, 1, 1);
        }
        return boundingBox;
    }
}();


/**
 * Compute the sphere bounding all objects in a scene graph.
 *
 * Note: This is based on the bounding spheres of the individual objects
 * in the scene, and not the set of all points in the scene, and will
 * therefore not be optimal.
 *
 * Returns a unity sphere if no relevant objects were found.
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
                boundingSphere.center.addScaledVector(vAB, 0.5 + rB);
            }
        });
        if (boundingSphere === null) {
            return new THREE.Sphere(new THREE.Vector3(), 1);
        }
        return boundingSphere;
    }
}();

/**
 * Work around for notebook issue #2730.
 */
var commOpenWithBuffers = function(comm, content, callbacks, metadata, buffers) {
    return comm.kernel.send_shell_message(
        "comm_open", content, callbacks, metadata, buffers);
}



/**
 * Create a new model from the JS side.
 *
 * This will be pushed to the python side.
 */
var createModel = function(constructor, widget_manager, obj) {

    var id = widgets.uuid();

    var modelOptions = {
        widget_manager: widget_manager,
        model_id: id,
        three_obj: obj,
    }
    var attributes = { };
    var widget_model = new constructor(attributes, modelOptions);

    widget_model.once('comm:close', () => {
        delete widget_manager._models[id];
    });

    var data, buffers;
    widget_manager._models[id] = widget_model.initPromise.then(() => {
        var split = widgets.remove_buffers(
            widget_model.serialize(widget_model.get_state(true)));
        data = {
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
        buffers = split.buffers;

        // Create un-opened comm:
        return widget_manager._create_comm(widget_manager.comm_target_name, id);

    }).then(comm => {
        var content = {
            'comm_id': id,
            'target_name': widget_manager.comm_target_name,
            'data': data
        };
        var metadata = {version: widgets.PROTOCOL_VERSION};

        commOpenWithBuffers(comm, content, null, metadata, buffers)

        widget_model.comm = comm;

        // Hook comm messages up to model.
        comm.on_close(_.bind(widget_model._handle_comm_closed, widget_model));
        comm.on_msg(_.bind(widget_model._handle_comm_msg, widget_model));

        widget_model.comm_live = true;

        return widget_model;
    });

    return widget_manager._models[id];
}


module.exports = {
    createModel: createModel,
    computeBoundingSphere: computeBoundingSphere,
    computeBoundingBox: computeBoundingBox,
}
