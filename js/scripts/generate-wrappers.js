var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Glob = require('glob').Glob;
var Promise = require('bluebird');
var Handlebars = require('handlebars');

Promise.promisifyAll(fs);
Promise.promisifyAll(fse);

var classConfigs = require('./three-class-config');
var Types = require('./prop-types.js');

var scriptDir = __dirname;
var baseDir = path.resolve(scriptDir, '..');

var jsSrcDir = path.resolve(baseDir, 'src/');
var pySrcDir = path.resolve(baseDir, '..', 'pythreejs');
var templateDir = path.resolve(scriptDir, 'templates');

var threeSrcDir = path.resolve(baseDir, 'node_modules', 'three', 'src');

var AUTOGEN_EXT = 'autogen';

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

var jsWrapperTemplate      = compileTemplate('js_wrapper');
var jsIndexTemplate        = compileTemplate('js_index');
var pyWrapperTemplate      = compileTemplate('py_wrapper');
var pyTopLevelInitTemplate = compileTemplate('py_top_level_init');

//
// Helper Functions
//

function isFile(filePath) {
    var stats = fs.statSync(filePath);
    return stats.isFile();
}

function isDir(filePath) {
    var stats = fs.statSync(filePath);
    return stats.isDirectory();
}

function getClassConfig(className, doLog) {

    // console.log('getClassConfig: ' + className);
    className = className.replace(/\./g, '_')
    if (!(className in classConfigs)) {
        throw new Error('invalid class name: ' + className);
    }

    var curClass = classConfigs[className];

    var result = {};
    _.extend(result, curClass);

    // combine cur props with superclass properties for allProperties
    result.allProperties = {};
    if (curClass.superClass && curClass.superClass !== classConfigs._defaults.superClass) {
        var superClassConfig = getClassConfig(curClass.superClass);
        _.extend(result.allProperties, superClassConfig.allProperties);
    }
    _.extend(result.allProperties, curClass.properties);

    // add defaults
    _.defaults(
        result, 
        classConfigs._defaults
    );

    return result;
}

function relativePathToPythonImportPath(relativePath) {

    var tokens = relativePath.split(path.sep);
    var firstToken = tokens[0];
    var sawFolderToken = false;

    if (tokens.length <= 0) { return '.'; }

    var result = '';
    if (firstToken == '.') {
        tokens = tokens.slice(1);
        result = '';
    } else if (firstToken == '..') {
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
    
        var promises = [];
        var result;

        // trailing slash will match only directories
        var glob = new Glob(globPattern, globOptions)
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

function mapPromiseFnOverThreeModules(mapFn) {
    return mapPromiseFnOverGlob('**/*.js', mapFn, { 
        cwd: threeSrcDir, 
        nodir: true ,
        ignore: [
            '**/Three.Legacy.js',
            '**/renderers/WebGLRenderer.js',
            '**/renderers/webgl/**',
            '**/renderers/shaders/**'
        ],
    });
}

// 
// Javascript wrapper writer
//

function JavascriptWrapper(modulePath) {

    this.jsDestPath = path.resolve(jsSrcDir, modulePath);
    this.destDir = path.dirname(this.jsDestPath);
    this.relativePathToBase = path.relative(this.destDir, jsSrcDir);

    this.jsAutoDestPath = path.resolve(
        this.destDir, 
        path.basename(this.jsDestPath, '.js') + '.' + AUTOGEN_EXT + '.js');

    this.className = path.basename(modulePath, '.js').replace(/\./g, '_');
    this.config = getClassConfig(this.className);

    this.modelName = this.className + 'Model';
    this.viewName = this.className + 'View';

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
_.extend(JavascriptWrapper.prototype, {

    getRequireInfoFromClassDescriptor: function(classDescriptor) {

        var result = {};

        if (typeof classDescriptor === 'string') {

            if (classDescriptor in classConfigs) {
                var config = getClassConfig(classDescriptor);
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
        result.viewName = result.className + 'View';

        result.absolutePath = path.resolve(jsSrcDir, result.relativePath);
        result.requirePath = path.relative(this.destDir, result.absolutePath);
        if (result.requirePath.charAt(0) !== '.') {
            result.requirePath = './' + result.requirePath;
        }

        return result;

    },

    processSuperClass: function() {

        var superClassDescriptor = this.config.superClass;
        this.superClass = this.getRequireInfoFromClassDescriptor(this.config.superClass);
        
    },

    processDependencies: function() {

        var dependencies = {};

        // process explicitly listed dependencies
        _.reduce(this.config.dependencies, function(result, depName) {

            result[depName] = this.getRequireInfoFromClassDescriptor(depName);
            return result;

        }, dependencies, this);

        // infer dependencies from any properties that reference other Three types
        _.reduce(this.config.properties, function(result, prop, propName) {

            if (prop instanceof Types.ThreeType || prop instanceof Types.ThreeTypeArray || prop instanceof Types.ThreeTypeDict) {
                if (prop.typeName !== 'this') {
                    if (typeof prop.typeName === 'string') {
                        result[prop.typeName] = this.getRequireInfoFromClassDescriptor(prop.typeName);        
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

    },

    processProperties: function() {

        this.properties = _.mapObject(this.config.properties, function(prop, propName) {

            return {
                defaultJson: prop.getJSPropertyValue(),
                property_array_name: prop.getPropArrayName(),
            };
        
        }, this);

        this.serializedProps = _.reduce(this.config.properties, function(result, prop, propName) {
            
            if (prop.serialize) {
                result.push(propName);
            }
            return result;

        }, []);

        this.enum_properties = _.reduce(this.config.properties, function(result, prop, propName) {
            if (prop.enumTypeName) {
                result[propName] = prop.enumTypeName;
            }
            return result;
        }, {});
    
    },

    processConstructorArgs: function() {

        function getConstructorParametersObject() {
            var result = [ '{' ];

            result = result.concat(_.keys(this.config.properties).map(function(propName) {
                return '                ' + propName + ": " + this.getModelToThreeGetter(propName) + ',';
            }, this))

            result.push('            }');
            return result;
        }

        var constructorArgs = this.config.constructorArgs.map(function(propName) {
            if (propName === 'parameters') {
                return getConstructorParametersObject.bind(this)().join('\n'); 
            } else {
                return this.getModelToThreeGetter(propName);
            }
        }, this);

        this.constructorArgs = constructorArgs;

    },

    processOverrideClass: function() {
    
        // check if manual file exists
        var customSrcPath = path.join(path.dirname(this.jsDestPath), path.basename(this.jsDestPath, '.js') + '.js');
        console.log(customSrcPath);

        var overrideModule = "Override";
        var overrideModel = overrideModule + "." + this.modelClass;
        var overrideView = overrideModule + "." + this.viewClass;

        if (!fs.existsSync(customSrcPath)) {
            return;
        }    

        console.log('EXISTS');

        this.overrideClass = {
            relativePath: './' + this.className + '.js',
            modelName: overrideModel,
            viewName: overrideView,
        };

    },

    getModelToThreeGetter: function(propName) {
        var prop = this.config.allProperties[propName];
        if (!prop) {
            throw new Error('invalid propName: ' + propName);
        }
        var converter = prop.propToValueConverterFn();
        if (converter) {
            return "this." + converter + "(this.get('" + propName + "'))";
        } else {
            return "this.get('" + propName + "')";
        }
    },

    getOutputFilename: function() {
        return this.jsAutoDestPath;
    },

});

function createJavascriptWrapper(modulePath) {

    try {
        var wrapper = new JavascriptWrapper(modulePath);
    } catch (e) {
        console.log('error creating wrapper: ');
        console.log(e);
        console.log('skipping: ' + modulePath);
        return Promise.resolve(false);
    }
    return fse.outputFileAsync(wrapper.getOutputFilename(), wrapper.output);

    // NOTE: Old implementation
    // var wrapper = new JavascriptWrapper(modulePath);
    // return wrapper.writeOutFile();
    
}

function writeJavascriptIndexFiles() {

    console.log('Writing javascript indices...');

    var excludes = [
        /\.swp$/,
        /\.DS_Store$/,
        /index\.js$/,
        './embed.js',
        './extension.js',
    ];

    // Regexp's
    var RE_AUTOGEN_EXT = /\.autogen\.js$/;
    var RE_JS_EXT = /\.js$/;

    function writeIndexForDir(dirPath, isTopLevel) {

        var dirAbsPath = path.resolve(jsSrcDir, dirPath);

        // Generate list of files in dir to include in index.js as require lines
        return fs.readdirAsync(dirAbsPath).then(function(dirFiles) {

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
                var shouldExclude = _.any(excludes, function(testPattern) {
                    if (testPattern instanceof RegExp) {
                        return testPattern.test(filePath);
                    } else if (typeof testPattern === 'string') {
                        return testPattern === filePath;
                    }
                });
                if (shouldExclude) { 
                    return false; 
                }

                // only load override classes if no autogen file is present
                // e.g. for WebGLRenderer.js
                // do not load override classes in index.js files
                // the override functionality is pull in via the autogen classes
                if (RE_JS_EXT.test(filePath) && !RE_AUTOGEN_EXT.test(filePath)) {
                    var dirname = path.dirname(filePath);
                    var basename = path.basename(filePath);
                    var autogenName = basename + '.' + AUTOGEN_EXT + '.js';
                    var autogenPath = path.join(dirname, autogenName);

                    // if autogen file exists, skip, otherwise, keep going
                    if (dirFiles.indexOf(autogenPath) > -1) {
                        return false;
                    }
                    
                    console.log('no autogen file exists for: ' + filePath);
                }

                return true;
            });

            // convert file paths relative to js src dir to paths relative to dirPath
            dirFiles = dirFiles.map(function(filePath) {
                return './' + path.basename(filePath);
            });

            // render template
            var context = {
                now: new Date(),
                generatorScriptName: path.basename(__filename),
                top_level: isTopLevel,
                submodules: dirFiles,
            };
            var output = jsIndexTemplate(context);
            var outputPath = path.resolve(jsSrcDir, dirPath, 'index.js');

            return fse.outputFileAsync(outputPath, output);

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

function PythonWrapper(modulePath) {

    this.modulePath = modulePath;
    this.dirRelativePath = path.dirname(modulePath);
    this.destDirAbsolutePath = path.resolve(pySrcDir, this.dirRelativePath);
    this.destDirRelativeToBase = path.relative(this.destDirAbsolutePath, pySrcDir);

    this.basename = path.basename(modulePath, '.js');
    this.className = this.basename.replace(/\./g, '_');

    this.pyDestPath = path.resolve(this.destDirAbsolutePath, this.className + '.py')
    this.pyAutoDestPath = path.resolve(this.destDirAbsolutePath, this.className + '_' + AUTOGEN_EXT + '.py');

    this.pyBaseRelativePath = path.relative(this.destDirAbsolutePath, pySrcDir);
    this.pyBaseRelativePath = relativePathToPythonImportPath(this.pyBaseRelativePath);

    this.config = getClassConfig(this.className);

    this.processSuperClass();
    this.processDependencies();
    this.processProperties();
    this.processDocsUrl();

    // Template and context
    this.template = pyWrapperTemplate;
    this.context = {
        now: new Date(),
        generatorScriptName: path.basename(__filename),
        threejs_docs_url: this.docsUrl,
        py_base_relative_path: this.pyBaseRelativePath,

        className: this.className,
        viewName: this.className + 'View',
        modelName: this.className + 'Model',
        superClass: this.superClass,
        properties: this.properties,
        dependencies: this.dependencies,
    };

    // Render template
    this.output = this.template(this.context);

}
_.extend(PythonWrapper.prototype, {
    
    getRequireInfoFromClassDescriptor: function(classDescriptor) {

        var result = {};

        if (typeof classDescriptor === 'string') {

            if (classDescriptor in classConfigs) {
                var config = getClassConfig(classDescriptor);
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

        if (!fs.existsSync(result.absolutePath + '.py')) {
            result.absolutePath += '_' + AUTOGEN_EXT;
        }

        result.requirePath = path.relative(this.destDirAbsolutePath, result.absolutePath);
        result.pyRelativePath = relativePathToPythonImportPath(result.requirePath);

        return result;

    },

    processSuperClass: function() {

        var superClassDescriptor = this.config.superClass;
        this.superClass = this.getRequireInfoFromClassDescriptor(this.config.superClass);

        if (this.superClass.className === 'Three') {
            this.superClass.className = 'ThreeWidget';
        }
    },

    processDependencies: function() {

        var dependencies = {};

        // process explicitly listed dependencies
        _.reduce(this.config.dependencies, function(result, depName) {

            result[depName] = this.getRequireInfoFromClassDescriptor(depName);
            return result;

        }, dependencies, this);

        // infer dependencies from any properties that reference other Three types
        _.reduce(this.config.properties, function(result, prop, propName) {

            if (prop instanceof Types.ThreeType || prop instanceof Types.ThreeTypeArray || prop instanceof Types.ThreeTypeDict) {
                if (prop.typeName !== 'this') {
                    if (typeof prop.typeName === 'string') {
                        result[prop.typeName] = this.getRequireInfoFromClassDescriptor(prop.typeName);        
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

    },

    processProperties: function() {

        this.properties = _.mapObject(this.config.properties, function(prop, propName) {

            return {
                trait_declaration: prop.getTraitlet(),
            };
        
        }, this);

    },

    processDocsUrl: function() {
    
        var refTokens = this.modulePath.split(path.sep);

        // capitalize elements in url
        refTokens = refTokens.map(function(token) {
            return token.charAt(0).toUpperCase() + token.slice(1);
        });
        // strip extension off filename
        refTokens[refTokens.length - 1] = path.basename(refTokens[refTokens.length - 1], '.js');

        var refUrl = 'http://threejs.org/docs/#Reference/' + refTokens.join('/');

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

    },

    getOutputFilename: function() {
        return this.pyAutoDestPath;
    },

});

function createPythonWrapper(modulePath) {

    try {
        var wrapper = new PythonWrapper(modulePath);
    } catch (e) {
        console.log('skipping: ' + modulePath);
        return Promise.resolve(false);
    }
    return fse.outputFileAsync(wrapper.getOutputFilename(), wrapper.output);

}

function createPythonModuleInitFile(modulePath) {

    var dirname = path.dirname(modulePath);
    var pyInitFilePath = path.resolve(pySrcDir, dirname, '__init__.py');
    return fse.ensureFileAsync(pyInitFilePath);

}

function createTopLevelPythonModuleFile() {

    var ignorePyFiles = [
        '**/__init__.py',
        'install.py',
        'sage.py'
    ];

    var modules = [];

    return mapPromiseFnOverGlob('**/*.py', function(filePath) {

        var modulePath = path.dirname(filePath);
        var moduleName = path.basename(filePath, '.py').replace(/\./g, '_');

        // check for override module.  
        // for py files, the override subclasses the autogen class, so we should
        // only import the override in our __init__.py file
        if (/autogen/.test(moduleName)) {
            var overrideName = moduleName.replace('_autogen', '');
            var overridePath = path.resolve(pySrcDir, modulePath, overrideName + '.py');
            if (fs.existsSync(overridePath)) {
                console.log('Python override exists: ' + overrideName + '. Skipping...');
                return;
            }
        }

        // convert relative path to python-style import path
        if (modulePath !== '.') {
            var importPath = '.' + modulePath.split(path.sep).join('.') + '.' + moduleName;
        } else {
            var importPath = '.' + moduleName;
        }

        modules.push({
            pyRelativePath: importPath,
        });

    }, {
        cwd: pySrcDir,
        nodir: true,
        ignore: ignorePyFiles,
    }).then(function() {

        // render template
        var context = {
            generatorScriptName: path.basename(__filename),
            now: new Date(),
            modules: modules,
        };
        var output = pyTopLevelInitTemplate(context);
        var outFilePath = path.resolve(pySrcDir, '__init__.py');

        return fse.outputFileAsync(outFilePath, output);

    });

}

function createJavascriptFiles() {

    return mapPromiseFnOverThreeModules(createJavascriptWrapper)
        .then(function() {
        
            return writeJavascriptIndexFiles();

        });

}

function createPythonFiles() {

    return mapPromiseFnOverThreeModules(function(relativePath) {

        createPythonWrapper(relativePath);

        // ensures each dir has empty __init__.py file for proper importing of sub dirs
        createPythonModuleInitFile(relativePath);

    }).then(function() {

        // top level __init__.py file imports *all* pythreejs modules into namespace
        return createTopLevelPythonModuleFile();

    });

}

function generateFiles() {

    return Promise.all([
        createJavascriptFiles(),
        createPythonFiles(),
    ]);

}

if (require.main === module) {
    generateFiles().then(function() {
        console.log('DONE');
    });
}
