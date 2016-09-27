var jupyter_threejs = require('./index');

var jupyterlab_widgets = require('jupyterlab_widgets/lib/plugin');

module.exports = {
  id: 'jupyter.extensions.jupyter-threejs',
  requires: [jupyterlab_widgets.IIPyWidgetExtension],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'jupyter-threejs',
          version: jupyter_threejs.version,
          exports: jupyter_threejs
      });
  },
  autoStart: true
};
