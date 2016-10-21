//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:19 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./AnimationLoader.autogen.js'),
    require('./BinaryTextureLoader.autogen.js'),
    require('./BufferGeometryLoader.autogen.js'),
    require('./Cache.autogen.js'),
    require('./CompressedTextureLoader.autogen.js'),
    require('./CubeTextureLoader.autogen.js'),
    require('./FontLoader.autogen.js'),
    require('./ImageLoader.autogen.js'),
    require('./JSONLoader.autogen.js'),
    require('./Loader.autogen.js'),
    require('./LoadingManager.autogen.js'),
    require('./MaterialLoader.autogen.js'),
    require('./ObjectLoader.autogen.js'),
    require('./TextureLoader.autogen.js'),
    require('./XHRLoader.autogen.js'),
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

