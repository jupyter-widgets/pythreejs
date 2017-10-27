var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Promise = require('bluebird');
var Handlebars = require('handlebars');

Promise.promisifyAll(fs);
Promise.promisifyAll(fse);

var shaderUtilsConfig = require('./three-shader-utils-config');

var scriptDir = __dirname;
var baseDir = path.resolve(scriptDir, '..');

var pySrcDir = path.resolve(baseDir, '..', 'pythreejs');
var templateDir = path.resolve(scriptDir, 'templates');

var AUTOGEN_EXT = 'autogen';
var JSON_AUTOGEN_EXT = '.' + AUTOGEN_EXT + '.json';


// We actually need access to THREE data here
var THREE = require('three');


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

var pyWrapperTemplate = compileTemplate('py_shader_utils');

var pathSep = /\\|\//;


//
// Helper functions
//

function mapPromiseFnOverObject(object, mapFn) {
    var promises = [];

    Object.keys(object).forEach(function(key) {
        var value = object[key];
        var result = mapFn(key, value);
        if (result instanceof Array) {
            promises = promises.concat(result);
        } else {
            promises.push(result);
        }
    }, this);

    return Promise.all(promises);
}


function createPythonWrapper(name, relativePath) {

    var data = THREE[name];

    var jsonPath = path.resolve(pySrcDir, relativePath + JSON_AUTOGEN_EXT);
    var promises = [fse.outputFileAsync(jsonPath, JSON.stringify(data, null, 4))];

    var pyPath = path.resolve(pySrcDir, relativePath + '_' + AUTOGEN_EXT + '.py');
    var output = pyWrapperTemplate({
        name: name,
        jsonPath: name + JSON_AUTOGEN_EXT,

        now: new Date(),
        generatorScriptName: path.basename(__filename),
    });
    promises.push(fse.outputFileAsync(pyPath, output))
    return Promise.all(promises);
}

function createPythonModuleInitFile(modulePath) {

    var dirname = path.dirname(modulePath);
    var pyInitFilePath = path.resolve(pySrcDir, dirname, '__init__.py');
    return fse.ensureFileAsync(pyInitFilePath);

}

function createPythonFiles() {

    // Prevent python file generation when outside dir (e.g. npm install in dependent)
    if (!fs.existsSync(pySrcDir)) {
        return Promise.resolve();
    }

    return mapPromiseFnOverObject(shaderUtilsConfig, function(name, configObj) {
        var relativePath = configObj.relativePath;
        return createPythonWrapper(name, relativePath).then(function() {
            // ensures each dir has empty __init__.py file for proper importing of sub dirs
            return createPythonModuleInitFile(relativePath);
        });
    });
}

function generateFiles() {

    return Promise.all([
        createPythonFiles(),
    ]);

}

if (require.main === module) {
    generateFiles().then(function() {
        console.log('DONE');
    });
}
