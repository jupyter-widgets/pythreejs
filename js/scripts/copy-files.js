'use strict';

const path = require('path');
const fse = require('fs-extra');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const threeBuildDir = path.resolve(baseDir, 'node_modules', 'three', 'build');
const staticDir = path.resolve(baseDir, '..', 'pythreejs', 'static');

const buildDir = path.resolve(baseDir, 'dist');
const docStaticDir = path.resolve(baseDir, '..', 'docs', 'source', '_static');

const exampleImagesSrcDir = path.resolve(baseDir, '..', 'examples', 'img');
const exampleImagesDstDir = path.resolve(baseDir, '..', 'docs', 'source', 'examples', 'img');


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

function copyExampleImagesToDocs() {
    return fse.readdir(exampleImagesSrcDir).then((dirFiles) => {
        return Promise.all(dirFiles.map(filePath => {
            return fse.copy(
                path.resolve(exampleImagesSrcDir, filePath),
                path.resolve(exampleImagesDstDir, filePath)
            ).then(function() {
                console.log(`Copied ${filePath} to docs examples' image folder`);
            });
        }));
    });
}


if (require.main === module) {
    // This script copies files after a build
    Promise.all([
        copyThree(),
        copyBundleToDocs(),
        copyExampleImagesToDocs(),
    ]);
}
