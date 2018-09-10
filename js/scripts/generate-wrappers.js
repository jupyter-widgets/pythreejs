'use strict';

const _ = require('underscore');
const path = require('path');
const fse = require('fs-extra');
const Glob = require('glob').Glob;
const Handlebars = require('handlebars');
const classConfigs = require('./three-class-config');
const Types = require('./prop-types.js');

const scriptDir = __dirname;
const baseDir = path.resolve(scriptDir, '..');

const jsSrcDir = path.resolve(baseDir, 'src/');
const pySrcDir = path.resolve(baseDir, '..', 'pythreejs');
const cppSrcDir = path.resolve(baseDir, '..', 'xthreejs/include/xthreejs');
const cppcppSrcDir = path.resolve(baseDir, '..', 'xthreejs/src');
const cmakeSrcDir = path.resolve(baseDir, '..', 'xthreejs');
const docSrcDir = path.resolve(baseDir, '..', 'docs', 'source', 'api');
const templateDir = path.resolve(scriptDir, 'templates');

const threeSrcDir = path.resolve(baseDir, 'node_modules', 'three', 'src');

const AUTOGEN_EXT = 'autogen';
const JS_AUTOGEN_EXT = '.' + AUTOGEN_EXT + '.js';


/**
 * Custom classes, i.e. classes that should be included in the
 * autogen routine but which has no *direct* counterpart in the
 * three.js library.
 */
const CUSTOM_CLASSES = [
    'textures/ImageTexture.js',
    'textures/TextTexture.js',
    'cameras/CombinedCamera.js',
    'controls/Controls.js',
    'controls/OrbitControls.js',
    'controls/TrackballControls.js',
    'controls/FlyControls.js',
    'controls/Picker.js',
    'core/BaseGeometry.js',
    'core/BaseBufferGeometry.js',
    'objects/CloneArray.js',
    'objects/Blackbox.js',
];

const IGNORE_FILES = [
    '**/Three.Legacy.js',   // Don't support legacy interface (deprecation should be done python side)
    '**/Three.js',          // Don't process aggregrate file
    '**/polyfills.js',      // Polyfill of JS methods, nothing to export
    '**/utils.js',          // Utility functions, no objects to export
    '**/constants.js',      // Processed into enums in separate script
    '**/audio/AudioContext.js',             // JS API for audio, nothing to expose
    '**/core/Face3.js',     // Implemented as trait only, not widget model
    '**/geometries/Geometries.js',          // index.js like file, nothing new here
    '**/materials/Materials.js',            // index.js like file, nothing new here
    '**/materials/MeshDistanceMaterial.js', // TODO: Undocumented as of yet
    '**/math/Vector2.js',   // Implemented as trait only, not widget model
    '**/math/Vector3.js',   // Implemented as trait only, not widget model
    '**/math/Vector4.js',   // Implemented as trait only, not widget model
    '**/math/Matrix3.js',   // Implemented as trait only, not widget model
    '**/math/Matrix4.js',   // Implemented as trait only, not widget model
    '**/math/Color.js',     // Implemented as trait only, not widget model
    '**/math/Euler.js',     // Implemented as trait only, not widget model
    '**/renderers/WebGLRenderer.js',        // For now, the internals of the webgl
    '**/renderers/WebGL2Renderer.js',       //   render is not exposed.
    //'**/renderers/webgl/**',
    '**/renderers/webgl/WebGLAttributes.js',
    '**/renderers/webgl/WebGLBackground.js',
    '**/renderers/webgl/WebGLClipping.js',
    '**/renderers/webgl/WebGLFlareRenderer.js',
    '**/renderers/webgl/WebGLMorphtargets.js',
    '**/renderers/webgl/WebGLRenderLists.js',
    '**/renderers/webgl/WebGLRenderStates.js',
    '**/renderers/webgl/WebGLSpriteRenderer.js',
    '**/renderers/webgl/WebGLTextures.js',
    '**/renderers/webgl/WebGLUniforms.js',
    '**/renderers/webgl/WebGLUtils.js',
    '**/renderers/webvr/**',
    '**/renderers/shaders/**',
    '**/extras/curves/Curves.js',                  // index.js like file, nothing new here
    '**/loaders/LoaderUtils.js',            // Only functions, nothing to export
    '**/extras/Earcut.js',                  // Only functions, nothing to export
    '**/extras/ShapeUtils.js',              // Only functions, nothing to export
    '**/extras/core/Interpolations.js',     // Only functions, nothing to export
    '**/textures/CanvasTexture.js'          // Canvases are not referenceable from python
];


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

const jsWrapperTemplate       = compileTemplate('js_wrapper');
const jsIndexTemplate         = compileTemplate('js_index');
const pyWrapperTemplate       = compileTemplate('py_wrapper');
const pyTopLevelInitTemplate  = compileTemplate('py_top_level_init');
const cppWrapperTemplate      = compileTemplate('cpp_wrapper');
const cppSrcTemplate          = compileTemplate('cpp_src');
const headerCppTemplate       = compileTemplate('cppheader_wrapper');
const cppSrcWrapperTemplate   = compileTemplate('cppsrc_wrapper');
const headerXthreeCppTemplate = compileTemplate('cppxthreeheader_wrapper');
const cmakeListsTemplate      = compileTemplate('cmake_wrapper');
const docTemplate             = compileTemplate('autodoc');
const docIndexTemplate        = compileTemplate('autodoc_index');

const pathSep = /\\|\//;

Handlebars.registerHelper('indent', function (data, indent) {
    const out = data.replace(/\n/g, '\n' + indent);
    return new Handlebars.SafeString(out);
});

Handlebars.registerHelper('rst', function (data, indent) {
    let out = data
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]');
    if (indent) {
        out = out.replace(/\n/g, '\n' + indent);
    }
    return new Handlebars.SafeString(out);
});

//
// Helper Functions
//

function getClassConfig(className) {

    // console.log('getClassConfig: ' + className);
    className = className.replace(/\./g, '_');
    if (!(className in classConfigs)) {
        throw new Error('invalid class name: ' + className);
    }

    const curClass = classConfigs[className];

    const result = Object.assign({}, curClass);

    result.propsDefinedByThree = [];
    result.propsDefinedByThree = result.propsDefinedByThree.concat(curClass.propsDefinedByThree || []);

    // combine cur props with superclass properties for allProperties
    result.allProperties = {};
    result.properties = result.properties || {};
    if (curClass.superClass && curClass.superClass !== classConfigs._defaults.superClass) {
        const superClassConfig = getClassConfig(curClass.superClass);
        Object.assign(result.allProperties, superClassConfig.allProperties);

        result.propsDefinedByThree = result.propsDefinedByThree.concat(superClassConfig.propsDefinedByThree || []);
    }
    Object.assign(result.allProperties, curClass.properties);

    // we want to inherit all propsDefinedByThree

    // add defaults
    _.defaults(
        result,
        classConfigs._defaults
    );

    if ('type' in result.allProperties && result.allProperties.type instanceof Types.String) {
        if ('type' in result.properties) {
            result.properties.type.defaultValue = className;
        } else {
            result.properties.type = new Types.String(className);
            result.allProperties.type = result.properties.type;
        }
    }

    return result;
}

/**
 * Finds any extra class definitions in addition to the default one.
 *
 * E.g. SphereGeometry.js defines both SphereGeometry and SphereBufferGeometry.
 * Given that both are defined in the class config with the same relativePath,
 * this function returns an array of extra definitions for that file, i.e.
 * ['SphereBufferGeometry'] for an input of 'SphereGeometry' in the example.
 */
function getExtraDefines(className) {

    className = className.replace(/\./g, '_');
    if (!(className in classConfigs)) {
        throw new Error('invalid class name: ' + className);
    }

    const relativePath = classConfigs[className].relativePath;

    const shared = [];
    Object.keys(classConfigs).forEach(function(key) {
        if (key[0] === '_') {
            return; // continue
        }
        const config = classConfigs[key];
        if (config.relativePath === relativePath && key !== className) {
            shared.push(key);
        }
    });
    if (shared.length > 0) {
        console.log('extra defines found: ' + shared);
    }
    return shared;
}

function relativePathToPythonImportPath(relativePath) {

    let tokens = relativePath.split(pathSep);
    const firstToken = tokens[0];
    let sawFolderToken = false;

    if (tokens.length <= 0) { return '.'; }

    let result = '';
    if (firstToken === '.') {
        tokens = tokens.slice(1);
        result = '';
    } else if (firstToken === '..') {
        tokens = tokens.slice(1);
        result = '.';
    }

    tokens.forEach(function(token) {
        if (token === '.') {
            return;
        } else if (token === '..') {
            result += '.';
        } else {
            result += '.' + token;
            sawFolderToken = true;
        }

    });

    if (!sawFolderToken) { result += '.'; }

    return result;
}

function camelCaseToUnderscore (str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase()
}

// Execute a function for each match to a glob query
//
// Parameters:
//   globPattern: String glob pattern for node-glob
//   mapFn:       Function function(pathRelativeToCwd), should return a promise or list of promises
//   globOptions: Object of options passed directly to node-glob
//
// Returns: Promise that resolves with array of results from mapFn applies to all glob matches
function mapPromiseFnOverGlob(globPattern, mapFn, globOptions) {

    return new Promise(function(resolve, reject) {

        let promises = [];
        let result;

        // trailing slash will match only directories
        new Glob(globPattern, globOptions)
            .on('match', function(match) {

                result = mapFn(match);
                if (result instanceof Array) {
                    promises = promises.concat(result);
                } else {
                    promises.push(result);
                }

            })
            .on('end', function() {
                // wait for all file ops to finish
                Promise.all(promises).then(resolve).catch(reject);
            })
            .on('error', function(err) {
                reject(err);
            })
            .on('abort', function() {
                reject(new Error('Aborted'));
            });

    });

}

function mapPromiseFnOverFileList(fileList, mapFn) {
    let promises = [];

    fileList.forEach(function(filePath) {
        const result = mapFn(filePath);
        if (result instanceof Array) {
            promises = promises.concat(result);
        } else {
            promises.push(result);
        }
    }, this);

    return Promise.all(promises);
}

function mapPromiseFnOverThreeModules(mapFn) {
    return mapPromiseFnOverGlob('**/*.js', mapFn, {
        cwd: threeSrcDir,
        nodir: true ,
        ignore: IGNORE_FILES,
    });
}

//
// Javascript wrapper writer
//

class JavascriptWrapper {

    constructor(modulePath, className) {

        this.jsDestPath = path.resolve(jsSrcDir, modulePath);
        this.destDir = path.dirname(this.jsDestPath);
        this.relativePathToBase = path.relative(this.destDir, jsSrcDir);

        this.jsAutoDestPath = path.resolve(
            this.destDir,
            path.basename(this.jsDestPath, '.js') + '.' + AUTOGEN_EXT + '.js');

        if (className) {
            this.className = className;
            this.jsAutoDestPath = path.resolve(
                path.dirname(this.jsAutoDestPath),
                className + '.' + AUTOGEN_EXT + '.js');
        } else {
            this.className = path.basename(modulePath, '.js').replace(/\./g, '_');
            const extraDefines = getExtraDefines(this.className);
            extraDefines.forEach(function(extraClassName) {
                createJavascriptWrapper(modulePath, extraClassName);
            });
        }

        this.config = getClassConfig(this.className);

        this.modelName = this.className + 'Model';

        // check if manual file exists
        const customSrcPath = path.join(path.dirname(this.jsDestPath), path.basename(this.jsDestPath, '.js') + '.js');
        this.hasOverride = fse.existsSync(customSrcPath);

        this.processSuperClass();
        this.processDependencies();
        this.processProperties();
        this.processConstructorArgs();
        this.processOverrideClass();

        // Template and context
        this.template = jsWrapperTemplate;
        this.context = {
            now: new Date(),
            generatorScriptName: path.basename(__filename),

            className: this.className,
            viewName: this.viewName,
            modelName: this.modelName,
            superClass: this.superClass,
            constructor: {
                args: this.constructorArgs,
            },
            properties: this.properties,
            dependencies: this.dependencies,
            props_created_by_three: this.config.propsDefinedByThree,
            serialized_props: this.serializedProps,
            enum_properties: this.enum_properties,
            override_class: this.overrideClass, // { relativePath }
        };

        // Render template
        this.output = this.template(this.context);

    }

    getRequireInfoFromClassDescriptor(classDescriptor) {

        const result = {};

        if (typeof classDescriptor === 'string') {

            if (classDescriptor in classConfigs) {
                const config = getClassConfig(classDescriptor);
                result.className = classDescriptor;
                result.relativePath = config.relativePath;
            } else {
                result.className = path.basename(classDescriptor, '.js');
                result.relativePath = classDescriptor;
            }

        } else {
            throw new Error('invalid classDescriptor: ' + classDescriptor);
        }

        result.modelName = result.className + 'Model';

        result.absolutePath = path.resolve(jsSrcDir, result.relativePath);
        let absPath = result.absolutePath;
        if (fse.existsSync(absPath + '.js')) {
            absPath += '.js';
        } else {
            absPath += JS_AUTOGEN_EXT;
        }
        result.requirePath = path.relative(this.destDir, absPath).replace(/\\/g, '/');
        if (result.requirePath.charAt(0) !== '.') {
            result.requirePath = './' + result.requirePath;
        }

        return result;

    }

    processSuperClass() {

        this.superClass = this.getRequireInfoFromClassDescriptor(this.config.superClass);

    }

    processDependencies() {

        const dependencies = {};

        // process explicitly listed dependencies
        _.reduce(this.config.dependencies, function(result, depName) {

            result[depName] = this.getRequireInfoFromClassDescriptor(depName);
            return result;

        }, dependencies, this);

        // infer dependencies from any properties that reference other Three types
        _.reduce(this.config.properties, function(result, prop) {

            if (prop instanceof Types.ThreeType || prop instanceof Types.InitializedThreeType ||
                    prop instanceof Types.ThreeTypeArray || prop instanceof Types.ThreeTypeDict) {
                if (prop.typeName !== 'this') {
                    if (typeof prop.typeName === 'string') {
                        let typeName = prop.typeName || './_base/Three';
                        result[typeName] = this.getRequireInfoFromClassDescriptor(typeName);
                    } else if (prop.typeName instanceof Array) {
                        prop.typeName.forEach(function(typeName) {
                            result[typeName] = this.getRequireInfoFromClassDescriptor(typeName);
                        }, this);
                    }
                }
            }
            return result;

        }, dependencies, this);

        this.dependencies = dependencies;

    }

    processProperties() {

        this.properties = _.mapObject(this.config.properties, function(prop) {

            return {
                defaultJson: prop.getJSPropertyValue(),
                property_array_name: prop.getPropArrayName(),
                property_converter: prop.getPropertyConverterFn(),
                property_assigner: prop.getPropertyAssignmentFn(),
            };

        }, this);

        this.serializedProps = _.mapObject(
            _.pick(this.config.properties,
                function(prop) {
                    return !!prop.serializer;
                }),
            function(prop) {
                return prop.serializer;
            }, {});

        this.enum_properties = _.reduce(this.config.properties, function(result, prop, propName) {
            if (prop.enumTypeName) {
                result[propName] = prop.enumTypeName;
            }
            return result;
        }, {});

    }

    processConstructorArgs() {

        function getConstructorParametersObject() {
            let result = [ '{' ];

            result = result.concat(_.keys(this.config.properties).map(function(propName) {
                return '                ' + propName + ': ' + this.getModelToThreeGetter(propName) + ',';
            }, this));

            result.push('            }');
            return result;
        }

        const constructorArgs = this.config.constructorArgs.map(function(propName) {
            if (propName === 'parameters') {
                return getConstructorParametersObject.bind(this)().join('\n');
            } else {
                return this.getModelToThreeGetter(propName);
            }
        }, this);

        this.constructorArgs = constructorArgs;

    }

    processOverrideClass() {

        if (!this.hasOverride) {
            return;
        }

        console.log('JS override exists for ' + this.className);

        const overrideModule = 'Override';
        const overrideModel = overrideModule + '.' + this.modelClass;

        this.overrideClass = {
            relativePath: './' + this.className + '.js',
            modelName: overrideModel,
        };

    }

    getModelToThreeGetter(propName) {
        const prop = this.config.allProperties[propName];
        if (!prop) {
            throw new Error('invalid propName: ' + propName);
        }
        const converter = prop.getPropertyConverterFn();
        if (converter) {
            return 'this.' + converter +  'ModelToThree(this.get(\'' + propName + '\'), \'' + propName +'\')';
        } else {
            return 'this.get(\'' + propName + '\')';
        }
    }

    getOutputFilename() {
        return this.jsAutoDestPath;
    }

}


function createJavascriptWrapper(modulePath, className) {

    let wrapper;
    try {
        wrapper = new JavascriptWrapper(modulePath, className);
    } catch (e) {
        console.log('error creating wrapper: ');
        console.log(e);
        console.log('skipping: ' + modulePath + (className ? ':' + className : ''));
        return Promise.resolve(false);
    }
    return fse.outputFile(wrapper.getOutputFilename(), wrapper.output);

    // NOTE: Old implementation
    // const wrapper = new JavascriptWrapper(modulePath);
    // return wrapper.writeOutFile();

}


function writeJavascriptIndexFiles() {

    console.log('Writing javascript indices...');

    const excludes = [
        /\.swp$/,
        /\.DS_Store$/,
        /index\.js$/,
        './embed.js',
        './extension.js',
    ];

    // Regexp's
    const RE_AUTOGEN_EXT = /\.autogen\.js$/;

    function writeIndexForDir(dirPath, isTopLevel) {

        const dirAbsPath = path.resolve(jsSrcDir, dirPath);

        // Generate list of files in dir to include in index.js as require lines
        return fse.readdir(dirAbsPath).then(function(dirFiles) {

            // get proper relative path for file
            dirFiles = dirFiles.map(function(filename) {
                return './' + path.join(dirPath, filename);
            });

            // filter excluded files
            dirFiles = dirFiles.filter(function(filePath) {

                // ignore autogen files in _base dir
                if (/_base/.test(dirPath) && RE_AUTOGEN_EXT.test(filePath)) {
                    return false;
                }

                // compare filePath to each exclude pattern
                const shouldExclude = _.any(excludes, function(testPattern) {
                    if (testPattern instanceof RegExp) {
                        return testPattern.test(filePath);
                    } else if (typeof testPattern === 'string') {
                        return testPattern === filePath;
                    }
                });
                if (shouldExclude) {
                    return false;
                }

                // if override class exists, load it in favor of the autogen file
                // e.g. for WebGLRenderer.js, Object3D.js, DataTexture.js
                // override classes should extend the autogen versions
                if (RE_AUTOGEN_EXT.test(filePath)) {

                    const dirname = path.dirname(filePath);
                    const basename = path.basename(filePath, JS_AUTOGEN_EXT);
                    const overrideName = basename + '.js';
                    const overridePath = './' + path.join(dirname, overrideName);

                    // override file present, so don't include autogen file in index
                    if (dirFiles.indexOf(overridePath) > -1) {
                        console.log('override exists for: ' + filePath);
                        return false;
                    }

                }

                return true;
            });

            // convert file paths relative to js src dir to paths relative to dirPath
            dirFiles = dirFiles.map(function(filePath) {
                return './' + path.basename(filePath);
            });

            // render template
            const context = {
                now: new Date(),
                generatorScriptName: path.basename(__filename),
                top_level: isTopLevel,
                submodules: dirFiles,
            };
            const output = jsIndexTemplate(context);
            const outputPath = path.resolve(jsSrcDir, dirPath, 'index.js');

            return fse.outputFile(outputPath, output);

        });
    }

    // map over all directories in js src dir
    return mapPromiseFnOverGlob(
        '**/', // trailing slash globs for dirs only
        function(dirPath) {
            return writeIndexForDir(dirPath, false);
        },
        { cwd: jsSrcDir, }
    ).then(function() {
        // write top-level index (not included in above glob)
        return writeIndexForDir('.', true);
    });

}


//
// Python wrapper writer
//

class PythonWrapper {

    constructor(modulePath, className) {

        this.modulePath = modulePath;
        this.dirRelativePath = path.dirname(modulePath);
        this.destDirAbsolutePath = path.resolve(pySrcDir, this.dirRelativePath);
        this.destDirRelativeToBase = path.relative(this.destDirAbsolutePath, pySrcDir);

        this.basename = path.basename(modulePath, '.js');

        if (className) {
            this.className = className;
        } else {
            this.className = this.basename.replace(/\./g, '_');
            const extraDefines = getExtraDefines(this.className);
            extraDefines.forEach(function(extraClassName) {
                createPythonWrapper(modulePath, extraClassName);
            });
        }

        this.pyDestPath = path.resolve(this.destDirAbsolutePath, this.className + '.py');
        this.pyAutoDestPath = path.resolve(this.destDirAbsolutePath, this.className + '_' + AUTOGEN_EXT + '.py');

        this.pyBaseRelativePath = path.relative(this.destDirAbsolutePath, pySrcDir);
        this.pyBaseRelativePath = relativePathToPythonImportPath(this.pyBaseRelativePath);

        // check if manual file exists
        this.hasOverride = fse.existsSync(this.pyDestPath);

        this.isCustom = CUSTOM_CLASSES.indexOf(modulePath) !== -1;

        this.hasParameters = false;

        this.config = getClassConfig(this.className);

        this.processSuperClass();
        this.processDependencies();
        this.processProperties();
        this.processDocsUrl();
        this.processConstructorArgs();

        // Template and context
        this.context = {
            now: new Date(),
            generatorScriptName: path.basename(__filename),
            threejs_docs_url: this.docsUrl,
            py_base_relative_path: this.pyBaseRelativePath,
            constructor: {
                args: this.constructorArgs,
                hasParameters: this.hasParameters,
            },

            className: this.className,
            modelName: this.className + 'Model',
            superClass: this.superClass,
            properties: this.properties,
            dependencies: this.dependencies,
            hasOverride: this.hasOverride,
            isCustom: this.isCustom,
            todo: this.config.todo || false,
        };

        // Render template
        this.output = pyWrapperTemplate(this.context);

    }

    getRequireInfoFromClassDescriptor(classDescriptor) {

        const result = {};

        if (typeof classDescriptor === 'string') {

            if (classDescriptor in classConfigs) {
                const config = getClassConfig(classDescriptor);
                result.className = classDescriptor;
                result.relativePath = config.relativePath;
            } else {
                result.className = path.basename(classDescriptor, '.js');
                result.relativePath = classDescriptor;
            }

        } else {
            throw new Error('invalid classDescriptor: ' + classDescriptor);
        }

        // get path of dependency relative to module dir
        result.absolutePath = path.resolve(pySrcDir, result.relativePath);

        if (!fse.existsSync(result.absolutePath + '.py')) {
            result.absolutePath += '_' + AUTOGEN_EXT;
        }

        result.requirePath = path.relative(this.destDirAbsolutePath, result.absolutePath);
        result.pyRelativePath = relativePathToPythonImportPath(result.requirePath);

        return result;

    }

    processSuperClass() {

        this.superClass = this.getRequireInfoFromClassDescriptor(this.config.superClass);

        if (this.superClass.className === 'Three') {
            this.superClass.className = 'ThreeWidget';
        }
    }

    processDependencies() {

        const dependencies = {};

        // process explicitly listed dependencies
        _.reduce(this.config.dependencies, function(result, depName) {

            result[depName] = this.getRequireInfoFromClassDescriptor(depName);
            return result;

        }, dependencies, this);

        // infer dependencies from any properties that reference other Three types
        _.reduce(this.config.properties, function(result, prop) {

            if (prop instanceof Types.ThreeType || prop instanceof Types.InitializedThreeType ||
                    prop instanceof Types.ThreeTypeArray || prop instanceof Types.ThreeTypeDict) {
                if (prop.typeName !== 'this') {
                    if (typeof prop.typeName === 'string') {
                        let typeName = prop.typeName || './_base/Three';
                        result[typeName] = this.getRequireInfoFromClassDescriptor(typeName);
                        if (result[typeName].className === 'Three') {
                            result[typeName].className = 'ThreeWidget';
                        }
                    } else if (prop.typeName instanceof Array) {
                        prop.typeName.forEach(function(typeName) {
                            result[typeName] = this.getRequireInfoFromClassDescriptor(typeName);
                        }, this);
                    }
                }
            }
            return result;

        }, dependencies, this);

        this.dependencies = dependencies;

    }

    processProperties() {

        this.properties = _.mapObject(this.config.properties, function(prop) {
            return {
                help: prop.options.help,
                trait_declaration: prop.getTraitlet(),
                defaultJson: prop.getPythonDefaultValue(),
            };
        }, this);

    }

    processConstructorArgs() {
        this.constructorArgs = this.config.constructorArgs.map(function(propName) {
            // Currently, we don't generate an __init__ method for classes that use the parameters
            // constructor arg
            if (propName === 'parameters') {
                this.hasParameters = true;
                return {
                    name: propName,
                    prop: {
                        defaultJson: '{}',
                    }
                };
            }
            return {
                name: propName,
                prop: {
                    defaultJson: this.config.allProperties[propName].getPythonDefaultValue(),
                }
            };
        }, this);
    }

    processDocsUrl() {

        if (this.isCustom) {
            this.docsUrl = null;
        }

        const refTokens = this.modulePath.split(pathSep);

        // strip extension off filename
        refTokens[refTokens.length - 1] = path.basename(refTokens[refTokens.length - 1], '.js');

        let refUrl = 'https://threejs.org/docs/#api/' + refTokens.join('/');

        // combine middle elements of url with dot
        refUrl = refUrl.replace('Renderers/WebGL/Plugins/', 'Renderers.WebGL.Plugins/');
        refUrl = refUrl.replace('Renderers/WebGL/', 'Renderers.WebGL/');
        refUrl = refUrl.replace('Renderers/Shaders/', 'Renderers.Shaders/');
        refUrl = refUrl.replace('Extras/Animation/', 'Extras.Animation/');
        refUrl = refUrl.replace('Extras/Core/', 'Extras.Core/');
        refUrl = refUrl.replace('Extras/Curves/', 'Extras.Curves/');
        refUrl = refUrl.replace('Extras/Geometries/', 'Extras.Geometries/');
        refUrl = refUrl.replace('Extras/Helpers/', 'Extras.Helpers/');
        refUrl = refUrl.replace('Extras/Objects/', 'Extras.Objects/');

        this.docsUrl = refUrl;

    }

    getOutputFilename() {
        return this.pyAutoDestPath;
    }

    getDocFilename() {
        return path.resolve(docSrcDir, this.dirRelativePath, `${this.className}_autogen.rst`);
    }

    getDocOutput() {
        return docTemplate(this.context);
    }

}

function createPythonWrapper(modulePath, className) {

    let wrapper;
    try {
        wrapper = new PythonWrapper(modulePath, className);
    } catch (e) {
        console.log(e);
        console.log('skipping: ' + modulePath + (className ? ':' + className : ''));
        return Promise.resolve(false);
    }
    let fname = wrapper.getOutputFilename();
    let pyPromise = fse.outputFile(fname, wrapper.output);

    // Also output documentation for the Python API
    let docfname = wrapper.getDocFilename();
    //console.log(docfname);
    //let docPromise = Promise.resolve();
    let docPromise = fse.outputFile(docfname, wrapper.getDocOutput());

    return Promise.all([pyPromise, docPromise]);
}

function createPythonModuleInitFile(modulePath) {

    let dirname = path.dirname(path.resolve(pySrcDir, modulePath));
    let pyInitFilePath;
    const promises = [];
    while (dirname !== pySrcDir) {
        pyInitFilePath = path.join(dirname, '__init__.py');
        promises.push(fse.ensureFile(pyInitFilePath));
        if (dirname === path.dirname(dirname)) {
            throw new Error(`${dirname}, ${path.dirname(dirname)}`);
        }
        dirname = path.dirname(dirname);
    }
    return Promise.all(promises);
}




function writeDocModuleFiles() {

    console.log('Writing document indices...');

    const RE_AUTOGEN = /index.rst/g;

    function writeIndexForDir(dirPath, isTopLevel) {

        const dirAbsPath = path.resolve(docSrcDir, dirPath);
        let moduleName;
        if (dirPath === '.') {
            moduleName = 'pythreejs';
        } else {
            moduleName = path.basename(dirPath);
        }

        // Generate list of files in dir to include in module as toc entries
        return fse.readdir(dirAbsPath).then(function(dirFiles) {

            // sort directories first:
            dirFiles = _.sortBy(dirFiles, filePath => {
                return fse.statSync(path.join(dirAbsPath, filePath)).isDirectory() ? 0 : 1;
            });

            dirFiles = dirFiles.filter(filePath => {
                return !filePath.match(RE_AUTOGEN);
            });

            // convert file paths to paths relative to dirPath
            dirFiles = dirFiles.map(filePath => {
                if (fse.statSync(path.join(dirAbsPath, filePath)).isDirectory()) {
                    return `./${filePath}/index`;
                }
                // Need to use forward slash for RST:
                return `./${path.basename(filePath)}`;
            });

            // render template
            const context = {
                now: new Date(),
                generatorScriptName: path.basename(__filename),
                moduleName: moduleName,
                submodules: dirFiles,
                top_level: isTopLevel,
            };
            const output = docIndexTemplate(context);
            const outputPath = path.resolve(docSrcDir, dirPath, 'index.rst');

            return fse.outputFile(outputPath, output);

        });
    }

    // map over all directories in js src dir
    return mapPromiseFnOverGlob(
        `**/`, // trailing slash globs for dirs only
        function(dirPath) {
            return writeIndexForDir(dirPath, false);
        },
        { cwd: docSrcDir, }
    ).then(function() {
        // write top-level index (not included in above glob)
        return writeIndexForDir('.', true);
    });

}

function createTopLevelPythonModuleFile() {

    const ignorePyFiles = [
        '**/__init__.py',
        'install.py',
        'sage.py'
    ];

    const ignoreDocFiles = [
        'enums',
        'pythreejs',
        'traits',
        '_package',
        '_version',
    ];

    const modules = [];

    return mapPromiseFnOverGlob('**/*.py', function(filePath) {

        const modulePath = path.dirname(filePath);
        const moduleName = path.basename(filePath, '.py').replace(/\./g, '_');

        // check for override module.
        // for py files, the override subclasses the autogen class, so we should
        // only import the override in our __init__.py file
        if (/autogen/.test(moduleName)) {
            const overrideName = moduleName.replace('_autogen', '');
            const overridePath = path.resolve(pySrcDir, modulePath, overrideName + '.py');
            if (fse.existsSync(overridePath)) {
                console.log('Python override exists: ' + overrideName + '. Skipping...');
                return;
            }
        }

        // convert relative path to python-style import path
        let importPath;
        if (modulePath !== '.') {
            importPath = '.' + modulePath.split(pathSep).join('.') + '.' + moduleName;
        } else {
            importPath = '.' + moduleName;
        }

        let docPath;
        if (ignoreDocFiles.indexOf(moduleName) === -1) {
            docPath = filePath.replace('_autogen', '').replace('.py', '') + '_autogen';
        } else {
            docPath = '';
        }

        modules.push({
            pyRelativePath: importPath,
            docRelativePath: docPath,
        });

    }, {
        cwd: pySrcDir,
        nodir: true,
        ignore: ignorePyFiles,
    }).then(function() {

        // render template
        const context = {
            generatorScriptName: path.basename(__filename),
            now: new Date(),
            modules: modules,
        };
        const output = pyTopLevelInitTemplate(context);
        const outFilePath = path.resolve(pySrcDir, '__init__.py');

        return fse.outputFile(outFilePath, output);

    });

}

//
// Cpp wrapper writer
//

class CppWrapper {

    constructor(modulePath, className) {

        this.modulePath = modulePath;
        this.dirRelativePath = path.dirname(modulePath);
        this.destDirAbsolutePath = path.resolve(cppSrcDir, this.dirRelativePath);
        this.destDirSrcAbsolutePath = path.resolve(cppcppSrcDir, this.dirRelativePath);
        this.destDirRelativeToBase = path.relative(this.destDirAbsolutePath, cppSrcDir);

        this.basename = path.basename(modulePath, '.js');

        if (className) {
            this.className = className;
        } else {
            this.className = this.basename.replace(/\./g, '_');
            const extraDefines = getExtraDefines(this.className);
            extraDefines.forEach(function(extraClassName) {
                createCppWrapper(modulePath, extraClassName);
            });
        }

        this.cppDestPath = path.resolve(this.destDirAbsolutePath, this.getUnderscoreRep(this.className) + '.hpp');
        
        this.cppAutoDestPath = path.resolve(this.destDirAbsolutePath, this.getUnderscoreRep(this.className) + '_' + AUTOGEN_EXT + '.hpp');
        this.cppSrcAutoDestPath = path.resolve(this.destDirSrcAbsolutePath, this.getUnderscoreRep(this.className) + '_' + AUTOGEN_EXT + '.cpp');

        this.cppBaseRelativePath = path.relative(this.destDirAbsolutePath, cppSrcDir);
        //this.cppBaseRelativePath = relativePathToPythonImportPath(this.cppBaseRelativePath);

        this.hppfile = path.relative(cppSrcDir, this.cppAutoDestPath);

        // check if manual file exists
        this.hasOverride = fse.existsSync(this.cppDestPath);

        this.isCustom = CUSTOM_CLASSES.indexOf(modulePath) !== -1;

        this.hasParameters = false;
        this.hasBuffer = false;

        this.config = getClassConfig(this.className);

        this.processSuperClass();
        this.processDependencies();
        this.processProperties();

        if (this.hasOverride){
            this.className = this.className + 'Base';
        }

        // Template and context
        this.context = {
            now: new Date(),
            generatorScriptName: path.basename(__filename),
            threejs_docs_url: this.docsUrl,
            cpp_base_relative_path: this.cppBaseRelativePath,
            constructor: {
                args: this.constructorArgs,
                hasParameters: this.hasParameters,
            },

            className: this.getUnderscoreRep(this.className, false),
            xclassName: this.getUnderscoreRep(this.className),
            header: 'XTHREE_' + this.getUnderscoreRep(this.className, false).toUpperCase() + '_HPP',
            hppfile: this.hppfile,
            modelName: this.className + 'Model',
            superClass: this.superClass,
            properties: this.properties,
            dependencies: this.dependencies,
            hasOverride: this.hasOverride,
            hasBuffer: this.hasBuffer,
            isCustom: this.isCustom,
        };

        // Render template
        this.output = cppWrapperTemplate(this.context);
        this.outputcpp = cppSrcWrapperTemplate(this.context);
    }

    getUnderscoreRep(className, with_x=true) {
        const REPLACE = {
            'web_g_l': 'webgl'
        };

        let class_name;
        _.mapObject(REPLACE, function(new_str, old_str) {
            class_name = camelCaseToUnderscore(className); 
            class_name = class_name.replace(old_str, new_str);
        });
        return (with_x) ? 'x' + class_name : class_name;
    }

    getRequireInfoFromClassDescriptor(classDescriptor) {

        const result = {};

        if (typeof classDescriptor === 'string') {

            if (classDescriptor in classConfigs) {
                const config = getClassConfig(classDescriptor);
                result.className = classDescriptor;
                result.relativePath = config.relativePath;
                let res = result.relativePath.split("/");
                res[res.length - 1] = this.getUnderscoreRep(res[res.length - 1]);
                result.relativePath = res.join("/");
            } else {
                result.className = path.basename(classDescriptor, '.js');
                result.relativePath = classDescriptor;
            }

        } else {
            throw new Error('invalid classDescriptor: ' + classDescriptor);
        }

        // get path of dependency relative to module dir
        if (result.className == 'Three') {
            result.relativePath = './base/xthree';
        };
        result.absolutePath = path.resolve(cppSrcDir, result.relativePath);

        if (!fse.existsSync(result.absolutePath + '.hpp')) {
            result.absolutePath += '_' + AUTOGEN_EXT;
        }

        result.requirePath = path.relative(this.destDirAbsolutePath, result.absolutePath);
        //result.cppRelativePath = relativePathToPythonImportPath(result.requirePath);
        result.cppRelativePath = result.requirePath;

        return result;

    }

    processSuperClass() {

        this.superClass = this.getRequireInfoFromClassDescriptor(this.config.superClass);

        if (this.superClass.className === 'Three') {
            this.superClass.className  = 'three_widget';
        }
        this.superClass.className = this.getUnderscoreRep(this.superClass.className, false);
        this.superClass.xclassName = this.getUnderscoreRep(this.superClass.className);
    }

    processDependencies() {

        const dependencies = {};

        // process explicitly listed dependencies
        _.reduce(this.config.dependencies, function(result, depName) {

            result[depName] = this.getRequireInfoFromClassDescriptor(depName);
            return result;

        }, dependencies, this);

        // infer dependencies from any properties that reference other Three types
        _.reduce(this.config.properties, function(result, prop) {

            if (prop instanceof Types.ThreeType || prop instanceof Types.InitializedThreeType ||
                    prop instanceof Types.ThreeTypeArray || prop instanceof Types.ThreeTypeDict) {
                if (prop.typeName !== 'this') {
                    if (typeof prop.typeName === 'string') {
                        let typeName = prop.typeName || './base/xthree.hpp';
                        result[typeName] = this.getRequireInfoFromClassDescriptor(typeName);
                        if (result[typeName].className === 'Three') {
                            result[typeName].className = 'ThreeWidget';
                        }
                    } else if (prop.typeName instanceof Array) {
                        prop.typeName.forEach(function(typeName) {
                            result[typeName] = this.getRequireInfoFromClassDescriptor(typeName);
                        }, this);
                    }
                }
            }
            return result;

        }, dependencies, this);

        this.dependencies = dependencies;

    }

    processProperties() {

        this.properties = _.mapObject(this.config.properties, function(prop, key) {
            if (prop.getCppProperty(key) !== 'undefined') {
                if (prop.isBinaryBuffer()){
                    this.hasBuffer = true;
                }
                return {
                    xproperty: prop.getCppProperty(key),
                    isBinaryBuffer: prop.isBinaryBuffer(),
                    defaultJson: prop.getCppDefaultValue(),
                };
            }
        }, this);
    }

    getOutputFilename() {
        return this.cppAutoDestPath;
    }

    getOutputSrcFilename() {
        return this.cppSrcAutoDestPath;
    }
}

function createCppWrapper(modulePath, className) {

    let wrapper;
    try {
        wrapper = new CppWrapper(modulePath, className);
    } catch (e) {
        console.log(e);
        console.log('skipping: ' + modulePath + (className ? ':' + className : ''));
        return Promise.resolve(false);
    }
    let fname = wrapper.getOutputFilename();
    let cppPromise = fse.outputFile(fname, wrapper.output);

    let fnameCpp = wrapper.getOutputSrcFilename();
    let cppcppPromise = fse.outputFile(fnameCpp, wrapper.outputcpp);

    // Also output documentation for the Python API
    //let docfname = wrapper.getDocFilename();
    //console.log(docfname);
    //let docPromise = Promise.resolve();
    //let docPromise = fse.outputFile(docfname, wrapper.getDocOutput());

    return Promise.all([cppPromise]);//, docPromise]);
}

function writeCMakeLists() {

    console.log('Writing CMakeLists...');

    // Regexp's
    const RE_AUTOGEN_EXT = /.hpp$/;
    const RE_AUTOGEN_EXT_CPP = /.cpp$/;

    const excludes = ['build'];

    const allFilesSync = (dir, fileList = []) => {
        fse.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file)
      
            const shouldExclude = _.any(excludes, function(testPattern) {
                if (testPattern instanceof RegExp) {
                    return testPattern.test(file);
                } else if (typeof testPattern === 'string') {
                    return testPattern === file;
                }
            });
            if (!shouldExclude) {
                if (fse.statSync(filePath).isDirectory()) {
                    allFilesSync(filePath, fileList);
                }
                else {
                    if (filePath.match(RE_AUTOGEN_EXT)) {
                        fileList.push(path.relative(cppSrcDir, filePath));
                    }
                }
            }
        })
        return fileList
      }

      const allFilesSyncCpp = (dir, fileList = []) => {
        fse.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file)
      
            const shouldExclude = _.any(excludes, function(testPattern) {
                if (testPattern instanceof RegExp) {
                    return testPattern.test(file);
                } else if (typeof testPattern === 'string') {
                    return testPattern === file;
                }
            });
            if (!shouldExclude) {
                if (fse.statSync(filePath).isDirectory()) {
                    allFilesSyncCpp(filePath, fileList);
                }
                else {
                    if (filePath.match(RE_AUTOGEN_EXT_CPP)) {
                        fileList.push(path.relative(cppcppSrcDir, filePath));
                    }
                }
            }
        })
        return fileList
      }

      var fileList = [];
      allFilesSync(cmakeSrcDir, fileList);
      var fileList_cpp = [];
      allFilesSyncCpp(cmakeSrcDir, fileList_cpp);
      const context = {
        hppfiles: fileList,
        cppfiles: fileList_cpp
    };
    const output = cmakeListsTemplate(context);
    const outputPath = path.join(cmakeSrcDir, 'CMakeLists.txt');

    return fse.outputFile(outputPath, output);
}

function writeHeaderCppFiles() {

    console.log('Writing HeaderCppFiles...');

    // Regexp's
    const RE_AUTOGEN_EXT = /.hpp$/;

    const excludes = ['build'];

    const allFilesSync = (dir, fileList = []) => {
        fse.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file)
      
            const shouldExclude = _.any(excludes, function(testPattern) {
                if (testPattern instanceof RegExp) {
                    return testPattern.test(file);
                } else if (typeof testPattern === 'string') {
                    return testPattern === file;
                }
            });
            if (!shouldExclude) {
                if (fse.statSync(filePath).isDirectory()) {
                    allFilesSync(filePath, fileList);
                }
                else {
                    if (filePath.match(RE_AUTOGEN_EXT)) {
                        fileList.push(path.relative(cppSrcDir, filePath));
                    }
                }
            }
        })
        return fileList
      }

    let xthree_hpp = []

    fse.readdirSync(cppSrcDir).forEach(dir => {
        const filePath = path.join(cppSrcDir, dir);
        if (fse.statSync(filePath).isDirectory()) {
            var fileList = [];
            allFilesSync(filePath, fileList);
            xthree_hpp.push(dir);
            const context = {
                dir: dir,
                header: dir.toUpperCase(),
                hppfiles: fileList
            };

        const output = headerCppTemplate(context);
        const outputPath = path.join(cppSrcDir, 'x' + dir + '.hpp');

        return fse.outputFile(outputPath, output);
        }
    });

    const context = {
        files: xthree_hpp
    };
    const output = headerXthreeCppTemplate(context);
    const outputPath = path.join(cppSrcDir, 'xthreejs.hpp');
    return fse.outputFile(outputPath, output);
}

function createJavascriptFiles() {
    return mapPromiseFnOverThreeModules(createJavascriptWrapper)
        .then(function() {
            return mapPromiseFnOverFileList(CUSTOM_CLASSES, createJavascriptWrapper);
        })
        .then(function() {
            return writeJavascriptIndexFiles();
        });
}

function createPythonFiles() {

    // Prevent python file generation when outside dir (e.g. npm install in dependent)
    if (!fse.existsSync(pySrcDir)) {
        return Promise.resolve();
    }

    return mapPromiseFnOverThreeModules(
        function(relativePath) {
            return createPythonWrapper(relativePath).then(function() {
                // ensures each dir has empty __init__.py file for proper importing of sub dirs
                return createPythonModuleInitFile(relativePath);
            });
        })
        .then(function() {
            return mapPromiseFnOverFileList(CUSTOM_CLASSES, function(relativePath) {
                return createPythonWrapper(relativePath).then(function() {
                    // ensures each dir has empty __init__.py file for proper importing of sub dirs
                    return createPythonModuleInitFile(relativePath);
                });
            });
        })
        .then(function() {
            // Manually ensure base init file is created
            return createPythonModuleInitFile('_base/__init__');
        })
        .then(function() {
            return writeDocModuleFiles();
        })
        .then(function() {
            // top level __init__.py file imports *all* pythreejs modules into namespace
            return createTopLevelPythonModuleFile();
        });

}

function createCppFiles() {

    // Prevent cpp file generation when outside dir (e.g. npm install in dependent)
    if (!fse.existsSync(cppSrcDir)) {
        return Promise.resolve();
    }

    return mapPromiseFnOverThreeModules(
        function(relativePath) {
            return createCppWrapper(relativePath);
        })
        .then(function() {
            return mapPromiseFnOverFileList(CUSTOM_CLASSES, function(relativePath) {
                return createCppWrapper(relativePath)
            });
        })
        .then(function() {
            return writeHeaderCppFiles();
        })
        .then(function() {
            return writeCMakeLists();
        });
}


function generateFiles() {

    return Promise.all([
        createJavascriptFiles(),
        createPythonFiles(),
        createCppFiles(),
    ]);

}

if (require.main === module) {
    generateFiles().then(function() {
        console.log('DONE');
    });
}
