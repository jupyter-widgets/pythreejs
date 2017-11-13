'use strict';

const path = require('path');
const fse = require('fs-extra');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const threeBuildDir = path.resolve(baseDir, 'node_modules', 'three', 'build');
const staticDir = path.resolve(baseDir, '..', 'pythreejs', 'static');


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
