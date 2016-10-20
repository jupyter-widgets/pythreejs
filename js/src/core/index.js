//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./BufferAttribute.autogen.js'),
    require('./BufferGeometry.autogen.js'),
    require('./Clock.autogen.js'),
    require('./DirectGeometry.autogen.js'),
    require('./EventDispatcher.autogen.js'),
    require('./Face3.autogen.js'),
    require('./Geometry.autogen.js'),
    require('./InstancedBufferAttribute.autogen.js'),
    require('./InstancedBufferGeometry.autogen.js'),
    require('./InstancedInterleavedBuffer.autogen.js'),
    require('./InterleavedBuffer.autogen.js'),
    require('./InterleavedBufferAttribute.autogen.js'),
    require('./Layers.autogen.js'),
    require('./Object3D.autogen.js'),
    require('./Object3D.js'),
    require('./Raycaster.autogen.js'),
    require('./Uniform.autogen.js'),
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

