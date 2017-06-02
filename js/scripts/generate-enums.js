var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Promise = require('bluebird');
var Handlebars = require('handlebars');

Promise.promisifyAll(fs);
Promise.promisifyAll(fse);

const enumConfigs = require('./three-enum-config');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const jsSrcDir = path.resolve(baseDir, 'src/');
const pySrcDir = path.resolve(baseDir, '..', 'pythreejs');
const templateDir = path.resolve(scriptDir, 'templates');

const threeSrcDir = path.resolve(baseDir, 'node_modules', 'three', 'src');

const jsEnumDst = path.resolve(jsSrcDir, '_base', 'enums.js');
const pyEnumDst = path.resolve(pySrcDir, 'enums.py');

//
// Actual THREE constants:
//

function parseThreeConstants() {
    var content = fs.readFileSync(path.resolve(threeSrcDir, 'constants.js'), 'utf-8');
    eval('var result = new function() {\n' + content.replace(/export var (.*?);/g, 'var $1;\nthis.$1;') + '}()');
    return result;
}

const threeEnums = parseThreeConstants();


//
// Templates
//

function compileTemplate(templateName) {
    var templateName = path.basename(templateName, '.mustache');
    var templatePath = path.resolve(templateDir, templateName + '.mustache');
    return Handlebars.compile(fs.readFileSync(templatePath, {
        encoding: 'utf-8'
    }));
}

var jsEnumTemplate = compileTemplate('js_enums');
var pyEnumTemplate = compileTemplate('py_enums');





function checkUnused() {
    return new Promise(function(resolve, reject) {
        var unusedThreeEnums = _.keys(threeEnums);

        _.keys(enumConfigs).map(function(category) {
            values = enumConfigs[category];
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

function writeJavascriptFile() {
    // Here we generate a code to enum string LUT

    var categories = [];

    _.keys(enumConfigs).map(function(category) {
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

    return fse.outputFileAsync(jsEnumDst, content);
}

function createJavascriptFiles() {
    return new Promise(function(resolve, reject) {
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

    return fse.outputFileAsync(pyEnumDst, content);
}

function createPythonFiles() {
    return new Promise(function(resolve, reject) {
        resolve(writePythonFile());
    });
}

function generateFiles() {

    return Promise.all([
        createJavascriptFiles(),
        createPythonFiles(),
        checkUnused(),
    ]);

}

if (require.main === module) {
    generateFiles().then(function() {
        console.log('DONE');
    });
}