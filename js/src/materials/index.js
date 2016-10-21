//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:19 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./LineBasicMaterial.autogen.js'),
    require('./LineDashedMaterial.autogen.js'),
    require('./Material.autogen.js'),
    require('./MeshBasicMaterial.autogen.js'),
    require('./MeshDepthMaterial.autogen.js'),
    require('./MeshLambertMaterial.autogen.js'),
    require('./MeshNormalMaterial.autogen.js'),
    require('./MeshPhongMaterial.autogen.js'),
    require('./MeshStandardMaterial.autogen.js'),
    require('./MultiMaterial.autogen.js'),
    require('./PointsMaterial.autogen.js'),
    require('./RawShaderMaterial.autogen.js'),
    require('./ShaderMaterial.autogen.js'),
    require('./SpriteMaterial.autogen.js'),
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

