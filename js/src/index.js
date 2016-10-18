//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:28 GMT-0700 (PDT)
//
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

// Load three.js extensions
require('./examples/controls/OrbitControls');

// Load all three.js python wrappers
var loadedModules = [
    require('./_base'),
    require('./animation'),
    require('./audio'),
    require('./cameras'),
    require('./core'),
    require('./examples'),
    require('./extras'),
    require('./lights'),
    require('./loaders'),
    require('./materials'),
    require('./math'),
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

