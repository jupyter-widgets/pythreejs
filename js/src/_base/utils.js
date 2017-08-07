
var widgets = require("@jupyter-widgets/base");



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

    let modelOptions = {
        widget_manager: widget_manager,
        model_id: id,
        three_obj: obj,
    }
    var attributes = { };
    let widget_model = new constructor(attributes, modelOptions);

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
}
