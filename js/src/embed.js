var threejs_semver = require('../package.json')['dependencies']['three']
if (window.require) {
    window.require.config({
        paths: {
            "three": ["three", "https://unpkg.com/three@" + threejs_semver + "/build/three.min.js"]
        }
    });
}
module.exports = require('./index.js')
