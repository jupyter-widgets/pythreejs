var jupyter_threejs = require('jupyter-threejs');

var jupyterlab_widgets = require('@jupyterlab/nbwidgets');

module.exports.default = {
  id: 'jupyter.extensions.jupyter-threejs',
  requires: [jupyterlab_widgets.INBWidgetExtension],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'jupyter-threejs',
          version: jupyter_threejs.version,
          exports: jupyter_threejs
      });
  },
  autoStart: true
};
