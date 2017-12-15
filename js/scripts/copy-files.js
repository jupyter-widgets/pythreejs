'use strict';

const path = require('path');
const fse = require('fs-extra');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const threeBuildDir = path.resolve(baseDir, 'node_modules', 'three', 'build');
const staticDir = path.resolve(baseDir, '..', 'pythreejs', 'static');

const buildDir = path.resolve(baseDir, 'dist');
const docStaticDir = path.resolve(baseDir, '..', 'docs', 'source', '_static');


function copyThree() {
    return fse.copy(
        path.resolve(threeBuildDir, 'three.min.js'),
        path.resolve(staticDir, 'three.js')
    ).then(function() {
        console.log('Copied three.js to static folder');
    });
}

function copyBundleToDocs() {
    return fse.copy(
        path.resolve(buildDir, 'index.js'),
        path.resolve(docStaticDir, 'jupyter-threejs.js')
    ).then(function() {
        console.log('Copied bundle to docs folder');
    });
}

function copyThreeToDocs() {
    return fse.copy(
        path.resolve(threeBuildDir, 'three.min.js'),
        path.resolve(docStaticDir, 'three.js')
    ).then(function() {
        console.log('Copied three.js to docs folder');
    });
}

if (require.main === module) {
    // This script copies files after a build
    Promise.all([
        copyThree(),
        copyBundleToDocs(),
        copyThreeToDocs(),
    ]);
}
