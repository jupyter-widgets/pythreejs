// Entry point for the notebook bundle containing custom model definitions.
//
// Setup notebook base URL
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
__webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/pythreejs/';

// Export widget models and views, and the npm package version number.
module.exports['version'] = require('../package.json').version;

// Load three.js into window namespace
var THREE = require('three');
window.THREE = THREE;

var loadedModules = [
    require('./jupyter-threejs'),
    require('./cameras'),
    require('./core'),
    require('./examples'),
    require('./extras'),
    require('./materials'),
    require('./objects'),
    require('./renderers'),
    require('./scenes'),
    require('./textures'),
];

for (var i in loadedModules) {
    if (loadedModules.hasOwnProperty(i)) {
        var loadedModule = loadedModules[i];
        for (var target_name in loadedModule) {
            if (loadedModule.hasOwnProperty(target_name)) {
                module.exports[target_name] = loadedModule[target_name];
            }
        }
    }
}