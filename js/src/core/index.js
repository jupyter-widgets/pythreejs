//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
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

