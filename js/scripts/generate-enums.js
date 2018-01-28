'use strict';

const _ = require('underscore');
const path = require('path');
const fse = require('fs-extra');
const Handlebars = require('handlebars');

const enumConfigs = require('./three-enum-config');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const jsSrcDir = path.resolve(baseDir, 'src/');
const pySrcDir = path.resolve(baseDir, '..', 'pythreejs');
const cppSrcDir = path.resolve(baseDir, '..', 'xthreejs/include/xthreejs');
const templateDir = path.resolve(scriptDir, 'templates');

const threeSrcDir = path.resolve(baseDir, 'node_modules', 'three', 'src');

const jsEnumDst = path.resolve(jsSrcDir, '_base', 'enums.js');
const pyEnumDst = path.resolve(pySrcDir, 'enums.py');
const cppEnumDst = path.resolve(cppSrcDir, 'base', 'xenums.hpp');

//
// Actual THREE constants:
//

function parseThreeConstants() {
    var content = fse.readFileSync(path.resolve(threeSrcDir, 'constants.js'), 'utf-8');
    var result;
    eval('result = new function() {\n' + content.replace(/export var (.*?);/g, 'var $1;\nthis.$1;') + '}()');
    return result;
}

const threeEnums = parseThreeConstants();


//
// Templates
//

function compileTemplate(templateName) {
    templateName = path.basename(templateName, '.mustache');
    const templatePath = path.resolve(templateDir, templateName + '.mustache');
    return Handlebars.compile(fse.readFileSync(templatePath, {
        encoding: 'utf-8'
    }));
}

var jsEnumTemplate = compileTemplate('js_enums');
var pyEnumTemplate = compileTemplate('py_enums');
var cppEnumTemplate = compileTemplate('cpp_enums');


//
// Helper functions
//

function checkUnused() {
    return new Promise(() => {
        var unusedThreeEnums = _.keys(threeEnums);

        _.keys(enumConfigs).map(function(category) {
            const values = enumConfigs[category];
            values.forEach(function(enumKey) {
                if (Array.isArray(enumKey)) {
                    // Several keys share the same value, remove all.
                    enumKey.forEach(function(subKey) {
                        unusedThreeEnums.splice(unusedThreeEnums.indexOf(subKey), 1);
                    });
                } else {
                    unusedThreeEnums.splice(unusedThreeEnums.indexOf(enumKey), 1);
                }
            }, this);
        }, this);

        if (unusedThreeEnums.length > 0) {
            console.error('Unreferenced constants: ', unusedThreeEnums);
        }
    });
}


//
// Generator functions
//

function writeJavascriptFile() {
    // Here we generate a code to enum string LUT

    var categories = [];

    _.keys(enumConfigs).map(category => {
        var categoryObj = {key: category, enums: []};
        categories.push(categoryObj);
        enumConfigs[category].forEach(function(enumKey) {
            if (Array.isArray(enumKey)) {
                // Several keys share the same value, use the first one.
                enumKey = enumKey[0];
            }
            categoryObj.enums.push({ key: enumKey, value: threeEnums[enumKey] });
        }, this);
    }, this);

    var content = jsEnumTemplate({
        now: new Date(),
        generatorScriptName: path.basename(__filename),

        categories: categories
    });

    return fse.outputFile(jsEnumDst, content);
}

function createJavascriptFiles() {
    return new Promise(function(resolve) {
        resolve(writeJavascriptFile());
    });
}

function writePythonFile() {
    // Here we generate lists of enum keys

    var categories = [];

    _.keys(enumConfigs).map(function(category) {
        var enums = [];
        enumConfigs[category].forEach(function(enumKey) {
            if (Array.isArray(enumKey)) {
                // Several keys share the same value, include all.
                enums = enums.concat(enumKey);
            } else {
                enums.push(enumKey);
            }
        });
        var categoryObj = {key: category, enums: enums};
        categories.push(categoryObj);
    });

    var content = pyEnumTemplate({
        now: new Date(),
        generatorScriptName: path.basename(__filename),

        categories: categories,
    });

    return fse.outputFile(pyEnumDst, content);
}

function createPythonFiles() {
    return new Promise(function(resolve) {
        resolve(writePythonFile());
    });
}

function writeCppFile() {
    // Here we generate lists of enum keys

    var categories = [];

    _.keys(enumConfigs).map(category => {
        var categoryObj = {key: category, enums: []};
        categories.push(categoryObj);
        enumConfigs[category].forEach(function(enumKey) {
            if (Array.isArray(enumKey)) {
                // Several keys share the same value, use the first one.
                enumKey = enumKey[0];
            }
            categoryObj.enums.push({ key: enumKey, value: threeEnums[enumKey] });
        }, this);
    }, this);

    var content = cppEnumTemplate({
        now: new Date(),
        generatorScriptName: path.basename(__filename),

        categories: categories
    });

    return fse.outputFile(cppEnumDst, content);
}

function createCppFiles() {
    return new Promise(function(resolve) {
        resolve(writeCppFile());
    });
}

function generateFiles() {

    return Promise.all([
        createJavascriptFiles(),
        createPythonFiles(),
        createCppFiles(),
        checkUnused(),
    ]);

}

if (require.main === module) {
    generateFiles().then(function() {
        console.log('DONE');
    });
}
