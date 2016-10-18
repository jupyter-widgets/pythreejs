//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:28 GMT-0700 (PDT)
//
// Load all three.js python wrappers
var loadedModules = [
    require('./Box2.autogen.js'),
    require('./Box3.autogen.js'),
    require('./Color.autogen.js'),
    require('./Euler.autogen.js'),
    require('./Frustum.autogen.js'),
    require('./Interpolant.autogen.js'),
    require('./Line3.autogen.js'),
    require('./Math.autogen.js'),
    require('./Matrix3.autogen.js'),
    require('./Matrix4.autogen.js'),
    require('./Plane.autogen.js'),
    require('./Quaternion.autogen.js'),
    require('./Ray.autogen.js'),
    require('./Sphere.autogen.js'),
    require('./Spherical.autogen.js'),
    require('./Spline.autogen.js'),
    require('./Triangle.autogen.js'),
    require('./Vector2.autogen.js'),
    require('./Vector3.autogen.js'),
    require('./Vector4.autogen.js'),
    require('./interpolants'),
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

