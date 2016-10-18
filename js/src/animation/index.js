//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:28 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./AnimationClip.autogen.js'),
    require('./AnimationMixer.autogen.js'),
    require('./AnimationObjectGroup.autogen.js'),
    require('./AnimationUtils.autogen.js'),
    require('./KeyframeTrack.autogen.js'),
    require('./PropertyBinding.autogen.js'),
    require('./PropertyMixer.autogen.js'),
    require('./tracks'),
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

