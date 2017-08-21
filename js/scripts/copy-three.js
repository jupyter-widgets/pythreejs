var path = require('path');
var fse = require('fs-extra');

var scriptDir = __dirname;
var baseDir = path.resolve(scriptDir, '..');

var threeBuildDir = path.resolve(baseDir, 'node_modules', 'three', 'build');
var staticDir = path.resolve(baseDir, '..', 'pythreejs', 'static');


function copyThree() {
    return fse.copy(
        path.resolve(threeBuildDir, 'three.js'),
        path.resolve(staticDir, 'three.js'));
}

if (require.main === module) {
    copyThree().then(function() {
        console.log('Copied three.js to static folder');
    });
}
