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

const DEBUG = process.argv.slice(2).indexOf('--debug') !== -1;



async function copyThree() {
    await fse.copy(
        path.resolve(threeBuildDir, DEBUG ? 'three.js' : 'three.min.js'),
        path.resolve(staticDir, 'three.js')
    );
    if (DEBUG) {
        console.log('Copied three.js to NB extension static folder');
    } else {
        console.log('Copied minified three.js to NB extension static folder');
    }
}

async function copyBundleToDocs() {
    await fse.copy(
        path.resolve(buildDir, 'index.js'),
        path.resolve(docStaticDir, 'jupyter-threejs.js')
    );
    console.log('Copied bundle to docs folder');
}

async function copyExampleImagesToDocs() {
    const dirFiles = await fse.readdir(exampleImagesSrcDir);
    await Promise.all(dirFiles.map(async (filePath) => {
        await fse.copy(
            path.resolve(exampleImagesSrcDir, filePath),
            path.resolve(exampleImagesDstDir, filePath)
        );
        console.log(`Copied ${filePath} to docs examples' image folder`);
    }));
}


if (require.main === module) {
    // This script copies files after a build
    Promise.all([
        copyThree(),
        copyBundleToDocs(),
        copyExampleImagesToDocs(),
    ]);
}
