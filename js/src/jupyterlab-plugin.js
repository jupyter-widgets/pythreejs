var base = require('@jupyter-widgets/base');
var version = require('./version');

module.exports = {
    id: 'jupyter.extensions.jupyter-threejs',
    requires: [base.IJupyterWidgetRegistry],
    activate: (app, widgets) => {
        widgets.registerWidget({
            name: 'jupyter-threejs',
            version: version.version,
            exports: function(){
                return new Promise(function(resolve, reject){
                    require.ensure(
                        ['./index'],
                        function(require) {
                            resolve(require('./index'));
                        },
                        function(err) {
                            console.error(err);
                            reject(err);
                        },
                        'jupyter-threejs-chunk'
                    );
                });
            }
        });
    },
    autoStart: true
};
