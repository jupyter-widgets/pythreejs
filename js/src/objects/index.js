//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./Bone.autogen.js'),
    require('./Group.autogen.js'),
    require('./LOD.autogen.js'),
    require('./LensFlare.autogen.js'),
    require('./Line.autogen.js'),
    require('./LineSegments.autogen.js'),
    require('./Mesh.autogen.js'),
    require('./Points.autogen.js'),
    require('./Skeleton.autogen.js'),
    require('./SkinnedMesh.autogen.js'),
    require('./Sprite.autogen.js'),
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

