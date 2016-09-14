var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Glob = require('glob').Glob;
var Promise = require('bluebird');
var Handlebars = require('handlebars');

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

function getClassConfig(className) {

    // console.log('getClassConfig: ' + className);
    className = className.replace(/\./g, '_')
    if (!(className in classConfigs)) {
        throw new Error('invalid class name: ' + className);
    }

    var result = classConfigs[className];
    _.defaults(
        result, 
        classConfigs._defaults
    );

    // console.log(result);

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
            '**/renderers/**'
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
                    result[prop.typeName] = this.getRequireInfoFromClassDescriptor(prop.typeName);        
                }
            } 
            return result;

        }, dependencies, this);
    
        this.dependencies = dependencies;

    },

    processProperties: function() {

        this.properties = _.mapObject(this.config.properties, function(prop, propName) {

            return {
                defaultJson: JSON.stringify(prop.defaultValue),
                property_array_name: prop.getPropArrayName(),
            };
        
        }, this);

        this.serializedProps = _.reduce(this.config.properties, function(result, prop, propName) {
            
            if (prop.serialize) {
                result.push(propName);
            }
            return result;

        }, []);
    
    },

    processConstructorArgs: function() {

        function getConstructorParametersObject() {
            var result = [ '{' ];

            result = result.concat(_.keys(this.config.properties).map(function(propName) {
                return '                ' + propName + ": this.get('" + propName + "'),";
            }, this))

            result.push('            }');
            return result;
        }

        var constructorArgs = this.config.constructorArgs.map(function(propName) {
            if (propName === 'parameters') {
                return getConstructorParametersObject.bind(this)().join('\n'); 
            } else {
                return "this.get('" + propName + "')";
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

    getOutputFilename: function() {
        return this.jsAutoDestPath;
    },

});

function createJavascriptWrapper(modulePath) {

    var wrapper = new JavascriptWrapper(modulePath);
    return fse.outputFileAsync(wrapper.getOutputFilename(), wrapper.output);

    // NOTE: Old implementation
    // var wrapper = new JavascriptWrapper(modulePath);
    // return wrapper.writeOutFile();
    
}

function writeJavascriptIndexForDir(dirPath, dirs, files, options) {

    console.log('Writing index file: ' + dirPath);
    // console.log(dirs);
    // console.log(files);

    options = (options == null) ? {} : options;

    var baseDirRetrace = path.relative(dirPath, jsSrcDir);

    var index = [
        "var loadedModules = [",
    ];

    if (options.header) {
        index = [ options.header ].concat(index);
    }

    files.forEach(function(filePath) {
        if (path.basename(dirPath) === '_base') {
            index.push("    require('./" + path.basename(path.basename(filePath, '.autogen.js'), '.js') + "'),");
        } else {
            if (/\.autogen\.js$/.test(filePath)) {
                index.push("    require('./" + path.basename(filePath, '.autogen.js') + "'),");
            }
        }
    });

    dirs.forEach(function(dirPath) {
        index.push("    require('./" + path.basename(dirPath) + "'),");
    });

    index = index.concat([
        "];",
        "",
        "for (var i in loadedModules) {",
        "    if (loadedModules.hasOwnProperty(i)) {",
        "        var loadedModule = loadedModules[i];",
        "        for (var target_name in loadedModule) {",
        "            if (loadedModule.hasOwnProperty(target_name)) {",
        "                module.exports[target_name] = loadedModule[target_name];",
        "            }",
        "        }",
        "    }",
        "}",
        "",
    ]);

    if (options.footer) {
        index = index.concat([ options.footer ]);
    }

    // trailing newline
    index.push("");

    fs.writeFileSync(path.resolve(dirPath, 'index.js'), index.join('\n'));

}

function writeJavascriptIndexFiles(dirPath, options) {

    console.log('Writing indices: ' + dirPath);
    // console.log(options);

    options = (options == null) ? {} : options;

    dirFiles = fs.readdirSync(dirPath).map(function(filename) {
        return path.join(dirPath, filename);
    });
    dirFiles = dirFiles.filter(function(filePath) {
        var fileName = path.basename(filePath);
        return !/\.swp$/.test(filePath)
            && !/index\.js$/.test(filePath);
    });


    if (options.exclude) {
        dirFiles = dirFiles.filter(function(filePath) {
            var relPath = './' + path.relative(jsSrcDir, filePath);
            return options.exclude.every(function(excludeStr) {
                if (excludeStr instanceof RegExp) {
                    return !excludeStr.test(relPath);
                } else {
                    return relPath !== excludeStr;
                }
            });
        });
    }

    // console.log(dirFiles);

    dirs = dirFiles.filter(function(filePath) {
        return isDir(filePath);
    });
    files = dirFiles.filter(function(filePath) {
        return isFile(filePath);
    });

    writeJavascriptIndexForDir(dirPath, dirs, files, options);
    dirs.forEach(function (childDirPath) {
        writeJavascriptIndexFiles(childDirPath, {

            exclude: [
                /\..*\.swp$/,
                /\..*\.swo$/,
            ],

        });
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
                    result[prop.typeName] = this.getRequireInfoFromClassDescriptor(prop.typeName);        
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

    var wrapper = new PythonWrapper(modulePath);
    return fse.outputFileAsync(wrapper.getOutputFilename(), wrapper.output);

}

function createPythonModuleInitFile(modulePath) {

    var dirname = path.dirname(modulePath);
    var pyInitFilePath = path.resolve(pySrcDir, dirname, '__init__.py');
    return fse.ensureFileAsync(pyInitFilePath);

}

function createTopLevelPythonModuleFile() {

    return new Promise(function(resolve, reject) {
    
        console.log('Creating top level python module file...');

        var moduleInitFilePath = path.resolve(pySrcDir, '__init__.py');

        // File content lines
        var header = [
            "#",
            "# This file automatically generated by " + path.basename(__filename),
            "# Date: " + new Date(),
            "#",
            "",
            "from __future__ import absolute_import",
            "",
        ];
        var imports = [];
        var footer = [
            "",
            "def _jupyter_nbextension_paths():",
            "    return [{",
            "        'section': 'notebook',",
            "        'src': 'static',",
            "        'dest': npm_pkg_name,",
            "        'require': npm_pkg_name + '/extension'",
            "    }]",
            "",
        ];

        var glob = new Glob('**/*.py', { 
            cwd: pySrcDir, 
            nodir: true,  
            ignore: [
                '**/__init__.py',
                'install.py',
                'sage.py'
            ],
        })
            .on('match', function(match) {

                var modulePath = path.dirname(match);
                var moduleName = path.basename(match, '.py').replace(/\./g, '_');

                if (/autogen/.test(moduleName)) {
                    var overrideName = moduleName.replace('_autogen', '');
                    var overridePath = path.resolve(pySrcDir, modulePath, overrideName + '.py');
                    if (fs.existsSync(overridePath)) {
                        console.log('Python override exists: ' + overrideName + '. Skipping...');
                        return;
                    }
                }

                if (modulePath !== '.') {
                    var importPath = '.' + modulePath.split(path.sep).join('.') + '.' + moduleName;
                } else {
                    var importPath = '.' + moduleName;
                }
                
                imports.push('from ' + importPath + ' import *');
                
            })
            .on('end', function() {

                // wait for all file ops to finish
                var fileContent = [].concat(header, imports, footer).join('\n');
                fse.outputFileAsync(moduleInitFilePath, fileContent)
                    .then(resolve)
                    .catch(reject);
                    
            })
            .on('error', function(err) {
                reject(err);
            })
            .on('abort', function() {
                reject(new Error('Aborted'));
            });

    });

}

function createJavascriptFiles() {

    return mapPromiseFnOverThreeModules(createJavascriptWrapper).then(function() {
    
        return writeJavascriptIndexFiles(jsSrcDir, {
                exclude: [
                    './embed.js',
                    './extension.js',
                    /\.DS_Store$/,
                ],
                header: [
                    "// Entry point for the notebook bundle containing custom model definitions.",
                    "//",
                    "// Setup notebook base URL",
                    "//",
                    "// Some static assets may be required by the custom widget javascript. The base",
                    "// url for the notebook is not known at build time and is therefore computed",
                    "// dynamically.",
                    "__webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/pythreejs/';",
                    "",
                    "// Export widget models and views, and the npm package version number.",
                    "module.exports['version'] = require('../package.json').version;",
                    "",
                    "// Load three.js into window namespace",
                    "var THREE = require('three');",
                    "window.THREE = THREE;",
                    "",
                    "// Load three.js extensions",
                    "require('./examples/controls/OrbitControls');",
                ].join('\n'),
                footer: [
                    "window.pythreejs = module.exports;",
                ]
            });

    });

}

function createPythonFiles() {

    return mapPromiseFnOverThreeModules(function(relativePath) {

        createPythonWrapper(relativePath);

        // ensures each dir has empty __init__.py file
        createPythonModuleInitFile(relativePath);

    }).then(function() {

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
