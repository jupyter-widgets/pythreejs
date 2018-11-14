'use strict';

const path = require('path');
const fse = require('fs-extra');
const Handlebars = require('handlebars');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const templateDir = path.resolve(scriptDir, 'templates');
const threeBuildDir = path.resolve(baseDir, 'node_modules', 'three', 'build');
const staticDir = path.resolve(baseDir, '..', 'pythreejs', 'static');

const buildDir = path.resolve(baseDir, 'dist');
const docStaticDir = path.resolve(baseDir, '..', 'docs', 'source', '_static');

const exampleImagesSrcDir = path.resolve(baseDir, '..', 'examples', 'img');
const exampleImagesDstDir = path.resolve(baseDir, '..', 'docs', 'source', 'examples', 'img');

const threejsSemver = require('../package.json')['dependencies']['three'];


const DEBUG = process.argv.slice(2).indexOf('--debug') !== -1;


function compileTemplate(templateName) {
    templateName = path.basename(templateName, '.mustache');
    const templatePath = path.resolve(templateDir, templateName + '.mustache');
    return Handlebars.compile(fse.readFileSync(templatePath, {
        encoding: 'utf-8',
        debug: DEBUG,
    }));
}


const jsBundleIndexTemplate = compileTemplate('js_bundle_helper');


async function generateBundleHelper(outputPath) {
    // render template
    const context = {
        threejsSemver: threejsSemver,
    };
    const output = jsBundleIndexTemplate(context);

    return fse.outputFile(outputPath, output);
}


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
    const calls = [
        generateBundleHelper(path.resolve(docStaticDir, 'helper.js')),
        fse.copy(
            path.resolve(buildDir, 'index.js'),
            path.resolve(docStaticDir, 'jupyter-threejs.js')
        ),
    ];
    await Promise.all(calls);
    console.log('Copied bundle to docs folder');
}

async function copyExampleImagesToDocs() {
    const dirFiles = await fse.readdir(exampleImagesSrcDir);
    await Promise.all(dirFiles.map(async (filePath) => {
        await fse.copy(
            path.resolve(exampleImagesSrcDir, filePath),
            path.resolve(exampleImagesDstDir, filePath)
        )
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
