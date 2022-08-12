'use strict';

const path = require('path');
const fse = require('fs-extra');
const Handlebars = require('handlebars');

const shaderUtilsConfig = require('./three-shader-utils-config');

const serializeUniforms = require('../src/_base/serializers').serializeUniforms;

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const pySrcDir = path.resolve(baseDir, '..', 'pythreejs');
const templateDir = path.resolve(scriptDir, 'templates');

const AUTOGEN_EXT = 'autogen';
const JSON_AUTOGEN_EXT = '.' + AUTOGEN_EXT + '.json';


// We actually need access to THREE data here
const THREE = require('three');


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

const pyWrapperTemplate = compileTemplate('py_shader_utils');


//
// Helper functions
//

function mapPromiseFnOverObject(object, mapFn) {
    let promises = [];

    Object.keys(object).forEach(function(key) {
        const value = object[key];
        const result = mapFn(key, value);
        if (result instanceof Array) {
            promises = promises.concat(result);
        } else {
            promises.push(result);
        }
    }, this);

    return Promise.all(promises);
}


async function createPythonWrapper(name, relativePath) {

    const data = THREE[name];
    let serialized;
    if (name === 'UniformsLib') {
        serialized = {};
        for (let section in data) {
            serialized[section] = serializeUniforms(data[section]);
        }
    } else if (name === 'ShaderLib') {
        serialized = {};
        for (let section in data) {
            if (data[section]['uniforms'] === undefined) {
                continue;
            }
            serialized[section] = { ...data[section]};
            serialized[section]['uniforms'] = serializeUniforms(data[section]['uniforms']);
        }
    } else {
        serialized = data;
    }

    const jsonPath = path.resolve(pySrcDir, relativePath + JSON_AUTOGEN_EXT);
    const promises = [fse.outputFile(jsonPath, JSON.stringify(serialized, null, 4))];

    const pyPath = path.resolve(pySrcDir, relativePath + '_' + AUTOGEN_EXT + '.py');
    const output = pyWrapperTemplate({
        name: name,
        jsonPath: name + JSON_AUTOGEN_EXT,

        now: new Date(),
        generatorScriptName: path.basename(__filename),
    });
    promises.push(fse.outputFile(pyPath, output));
    await Promise.all(promises);
}

async function createPythonModuleInitFile(modulePath) {

    const dirname = path.dirname(modulePath);
    const pyInitFilePath = path.resolve(pySrcDir, dirname, '__init__.py');
    await fse.ensureFile(pyInitFilePath);

}

function createPythonFiles() {

    // Prevent python file generation when outside dir (e.g. npm install in dependent)
    if (!fse.existsSync(pySrcDir)) {
        return Promise.resolve();
    }

    return mapPromiseFnOverObject(shaderUtilsConfig, async function(name, configObj) {
        const relativePath = configObj.relativePath;
        await createPythonWrapper(name, relativePath);

        // ensures each dir has empty __init__.py file for proper importing of sub dirs
        await createPythonModuleInitFile(relativePath);
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
