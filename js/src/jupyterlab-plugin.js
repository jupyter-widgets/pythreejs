var jupyter_threejs = require('./index');

var base = require('@jupyter-widgets/base');

module.exports = {
    id: 'jupyter.extensions.jupyter-threejs',
    requires: [base.IJupyterWidgetRegistry],
    activate: function(app, widgets) {
        widgets.registerWidget({
            name: 'jupyter-threejs',
            version: jupyter_threejs.EXTENSION_SPEC_VERSION,
            exports: jupyter_threejs
        });
    },
    autoStart: true
};
