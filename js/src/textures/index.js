//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./CanvasTexture.autogen.js'),
    require('./CompressedTexture.autogen.js'),
    require('./CubeTexture.autogen.js'),
    require('./DataTexture.autogen.js'),
    require('./Texture.autogen.js'),
    require('./VideoTexture.autogen.js'),
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

