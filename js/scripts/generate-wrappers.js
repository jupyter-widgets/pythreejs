var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Glob = require('glob').Glob;
var Promise = require('bluebird');

Promise.promisifyAll(fse);

var classConfigs = require('./three-class-config');

var scriptDir = __dirname;
var baseDir = path.resolve(scriptDir, '..');

var jsSrcDir = path.resolve(baseDir, 'src/');
var pySrcDir = path.resolve(baseDir, '..', 'pythreejs');

var threeSrcDir = path.resolve(baseDir, 'node_modules', 'three', 'src');

var AUTOGEN_EXT = 'autogen'

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

    var result = classConfigs[className.replace(/\./g, '_')];
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

// 
// Javascript wrapper writer
//

function JavascriptWrapper(modulePath) {

    this.jsDestPath = path.resolve(jsSrcDir, modulePath);
    this.destDir = path.dirname(this.jsDestPath);

    this.jsAutoDestPath = path.resolve(
        this.destDir, 
        path.basename(this.jsDestPath, '.js') + '.' + AUTOGEN_EXT + '.js');

    this.className = path.basename(modulePath, '.js').replace(/\./g, '_');
    this.config = getClassConfig(this.className);

    this.modelClass = this.className + 'Model';
    this.viewClass = this.className + 'View';

    var superClassDescriptor = this.config.superClass;
    if (typeof superClassDescriptor === 'string') {

        if (superClassDescriptor in classConfigs) {
            var config = classConfigs[superClassDescriptor];
            this.superClassName = superClassDescriptor;
            this.superModuleRelativePath = config.relativePath;
        } else {
            this.superClassName = path.basename(superClassDescriptor, '.js');
            this.superModuleRelativePath = superClassDescriptor; 
        }
    } else {
        throw new Error('invalid superClass: ' + this.config.superClass);
    }

    this.modelSuperClass = this.superClassName + 'Model';
    this.viewSuperClass = this.superClassName + 'View';

    // console.log('modulePath: ' + modulePath);
        
}
_.extend(JavascriptWrapper.prototype, {

    getOutputFilename: function() {
        return this.jsAutoDestPath;
    },

    getOutput: function() {
        var body = [];
        body = body.concat(this.getHeader());
        body = body.concat(this.getSuperclassRequire());
        body = body.concat(this.getDependencyRequires());
        body.push("");
        body = body.concat(this.getModelOutput());
        body = body.concat(this.getViewOutput());
        body = body.concat(this.getCustomImplementationOverrideOutput());
        body = body.concat(this.getFooter());
        return body.join('\n');
    },

    getHeader: function() {
        return [
            "//",
            "// This file auto-generated with " + path.basename(__filename),
            "// Date: " + new Date(),
            "//",
            "",
            "var _ = require('underscore');",
            "var widgets = require('jupyter-js-widgets');",
            "",
        ];
    },

    getSuperclassRequire: function() {

        return [
            this.getDependencyRequireLine({
                relativePath: this.superModuleRelativePath,
                className: this.modelSuperClass
            }),
            this.getDependencyRequireLine({
                relativePath: this.superModuleRelativePath,
                className: this.viewSuperClass
            }),
            "",
        ];
    },

    getDependencyRequires: function() {
        
        var relativePathToBase = path.relative(this.destDir, jsSrcDir);

        var result = [];

        var deps = this.config.jsDependencies || [];
        result = result.concat(deps.map(function(dep) {
            return this.getDependencyRequireLine(dep);
        }, this));

        return result;
    },

    getDependencyRequireLine: function(dep) {

        var className;
        var relativePath;

        if (typeof dep === 'string') {

            var moduleName = dep.replace(/(View|Model)/, '');
            var depConfig = getClassConfig(className);
            className = dep;
            relativePath = depConfig.relativePath;
        
        } else if (typeof dep === 'object'){

            className = dep.className;
            relativePath = dep.relativePath;

        } else {
            throw new Error('invalid dep: ' + dep);
        }

        relativePath = path.relative(this.destDir, path.resolve(jsSrcDir, relativePath));
        return "var " + className + " = require('./" + relativePath + "')." + className + ";";
    },

    getFooter: function() {
        return [
            "module.exports = {",
            "    " + this.viewClass + ": " + this.viewClass + ",",
            "    " + this.modelClass + ": " + this.modelClass + ",",
            "};",
            "",
        ]
    },

    getConstructorParametersObject: function() {
        var result = [ '{' ];

        result = result.concat(_.keys(this.config.properties).map(function(propName) {
            return '                ' + propName + ": this.get('" + propName + "'),";
        }, this))

        result.push('            }');
        return result;
    },

    getModelOutput: function() {

        var threeConstructorArgs = this.config.constructorArgs.map(function(propName) {
            if (propName === 'parameters') {
                return this.getConstructorParametersObject().join('\n'); 
            } else {
                return "this.get('" + propName + "')";
            }
        }, this);

        var result = [];

        // console.log(this.config.properties);
        var serializedProperties = _.filter(_.keys(this.config.properties), function(propName) {
            return this.config.properties[propName].serialize;
        }, this);

        result = result.concat([
            "var " + this.modelClass + " = " + this.modelSuperClass + ".extend({",
            "    defaults: _.extend({}, " + this.modelSuperClass + ".prototype.defaults, {",
            "        _view_name: '" + this.viewClass + "',",
            "        _model_name: '" + this.modelClass + "',",
            "",
        ]);

        result = result.concat(_.map(this.config.properties, function(prop, propName) {
            return "        " + propName + ": " + JSON.stringify(prop.defaultValue) + ",";
        }));

        result = result.concat([
            "    }),",
            "",
        ]);

        // constructThreeObject()
        result = result.concat([
            "    constructThreeObject: function() {",
        ]);

        if (threeConstructorArgs.length > 0) {
            result.push("        return new THREE." + this.className + "(");

            result = result.concat(threeConstructorArgs.map(function(arg, idx, list) {
                return ('            ' + arg + (idx === list.length - 1 ? '' : ',')); 
            }));

            result.push("        );"); 
        } else {
            result.push("        return new THREE." + this.className + "();");
        }
        result.push("    },", "");

        // new_properties()
        result.push(
            "    createPropertiesArrays: function() {",
            "        " + this.modelSuperClass + ".prototype.createPropertiesArrays.call(this);"
        );

        result = result.concat(_.map(this.config.properties, function(prop, propName) {
            var propType = prop.propertyType || 'scalar';

            var result = "        this." + prop.getPropArrayName() + ".push('" + propName + "');";
            if (prop.enumTypeName) {
                result += "\n        this.enum_property_types['" + propName + "'] = '" + prop.enumTypeName + "';";
            }
            return result;
        }));

        result = result.concat(_.map(this.config.propsDefinedByThree, function(propName) {
            return "        this.props_created_by_three['" + propName + "'] = true;"
        }));

        result.push(
            "    },",
            ""
        );

        // handle serialized properties
        if (serializedProperties.length <= 0) {
            result.push("});", "", "");
        } else {
            result = result.concat(
                [ 
                    "}, {",
                    "    serializers: _.extend({",
                    
                ], 
                serializedProperties.map(function(propName) {
                    return "        " + propName + ": { deserialize: widgets.unpack_models },"
                }), 
                [ 
                    "    }, " + this.modelSuperClass + ".serializers)",
                    "});",
                    "",
                    "",
                ]
            );
        }

        return result;
    },

    getViewOutput: function() {

        var result = [
            "var " + this.viewClass + " = " + this.viewSuperClass + ".extend({",
        ];

        result = result.concat([ "});", "", "" ]);
        return result;
    },

    getCustomImplementationOverrideOutput: function() {

        // check if manual file exists
        var customSrcPath = this.jsDestPath;

        var overrideModule = "Override";
        var overrideModel = overrideModule + "." + this.modelClass;
        var overrideView = overrideModule + "." + this.viewClass;

        if (!fs.existsSync(customSrcPath)) {
            return [];
        }    

        return [
            "// Override auto-gen class with custom implementation",
            "var " + overrideModule + " = require('./" + this.className + ".js');",
            "_.extend(" + this.modelClass + ".prototype, " + overrideModel + ".prototype);",
            "_.extend(" + this.modelClass + ", " + overrideModel + ");", 
            "_.extend(" + this.viewClass + ".prototype, " + overrideView + ".prototype);",
            "_.extend(" + this.viewClass + ", " + overrideView + ");",
            "",
        ];
    },

    writeOutFile: function() {
        return fse.outputFileAsync(this.getOutputFilename(), this.getOutput())
    },
});


// 
// Python wrapper writer
//

function PythonWrapper(modulePath) {

    var dirname = path.dirname(modulePath);
    var basename = path.basename(modulePath, '.js');

    this.className = basename.replace(/\./g, '_'); 
    this.modulePath = modulePath;

    this.destDir = path.resolve(pySrcDir, dirname);

    this.pyDestPath = path.resolve(this.destDir, this.className + '.py')
    this.pyAutoDestPath = path.resolve(this.destDir, this.className + '_' + AUTOGEN_EXT + '.py');

    this.config = getClassConfig(this.className);

    var superClassDescriptor = this.config.superClass;
    if (typeof superClassDescriptor === 'string') {
    
        if (superClassDescriptor in classConfigs) {
            var config = classConfigs[superClassDescriptor];
            this.superClassName = superClassDescriptor;
            this.superModuleRelativePath = config.relativePath;
        } else {
            this.superClassName = path.basename(superClassDescriptor, '.js');
            if (this.superClassName === 'Three') {
                this.superClassName = 'ThreeWidget';
            }
            this.superModuleRelativePath = superClassDescriptor; 
        }

    } else {
        throw new Error('invalid superclass: ' + this.config.superClass);
    }

}
_.extend(PythonWrapper.prototype, {
    
    getOutputFilename: function() {
        return this.pyAutoDestPath;
    },

    getOutput: function() {
        var body = [];
        body = body.concat(this.getHeader());
        body = body.concat(this.getSuperclassRequire());
        body = body.concat(this.getDependencyRequires());
        body.push("");
        body = body.concat(this.getPythonClassOutput());
        body = body.concat(this.getFooter());
        return body.join('\n');
    },

    getHeader: function() {
        var pyBaseRelativePath = path.relative(
            this.destDir,
            pySrcDir);

        // console.log(pyBaseRelativePath);

        pyBaseRelativePath = relativePathToPythonImportPath(pyBaseRelativePath);

        // console.log(this.destDir);
        // console.log(pySrcDir);
        // console.log(pyBaseRelativePath);
        // console.log('');

        return [
            "from ipywidgets import Widget, DOMWidget, widget_serialization, Color",
            "from traitlets import Unicode, Int, CInt, Instance, This, Enum, Tuple, List, Dict, Float, CFloat, Bool",
            "",
            "from " + pyBaseRelativePath + "enums import *",
            "from " + pyBaseRelativePath + "traits import *",
            "",
        ];
    },

    getSuperclassRequire: function() {

        return [
            this.getDependencyRequireLine({
                relativePath: this.superModuleRelativePath,
                className: this.superClassName 
            }),
            "",
        ];

    },

    getDependencyRequires: function() {

        if (!this.config.dependencies) { 
            return []; 
        }

        return this.config.dependencies.map(function(dep) {
            return this.getDependencyRequireLine(dep);
        }, this);
    },  

    getDependencyRequireLine: function(dep) {

        var className;
        var relativePath;

        if (typeof dep === 'string') {

            var className = dep;
            var depConfig = getClassConfig(className);
            relativePath = depConfig.relativePath;
    
        } else if (typeof dep === 'object') {

            className = dep.className;
            relativePath = dep.relativePath;
    
        } else {
            throw new Error('invalid dep: ' + dep);
        }


        // get path of dependency relative to module dir
        relativePath = path.resolve(pySrcDir, relativePath);

        if (!fs.existsSync(relativePath + '.py')) {
            relativePath += '_autogen';
        }

        relativePath = path.relative(this.destDir, relativePath);
        return 'from ' + relativePathToPythonImportPath(relativePath) + ' import ' + className;
    },

    getPythonClassOutput: function() {

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

        var output = [];
        output = output.concat([
            "class " + this.className + "(" + this.superClassName + ")" + ":",
            "    \"\"\"" + this.className,
            "    ",
            "    Autogenerated by " + path.basename(__filename),
            "    Date: " + new Date(),
            "    See " + refUrl,
            "    \"\"\"",
            "    ",
            "    _view_name = Unicode('" + this.className + "View').tag(sync=True)",
            "    _model_name = Unicode('" + this.className + "Model').tag(sync=True)",
            "    ",
        ]);

        output = output.concat(_.map(this.config.properties, function(prop, propName) {

            var result = "    " + propName + " = " + prop.getTraitlet(); 
            return result;

        }));

        return output;

    },

    getFooter: function() {
        return [ "" ];
    },

    writeOutFile: function() {
        return fse.outputFileAsync(this.getOutputFilename(), this.getOutput())
    },

});

function createJavascriptWrapper(modulePath) {

    var wrapper = new JavascriptWrapper(modulePath);
    return wrapper.writeOutFile();
    
}

function writeIndexForDir(dirPath, dirs, files, options) {

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

function writeIndices(dirPath, options) {

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

    writeIndexForDir(dirPath, dirs, files, options);
    dirs.forEach(function (childDirPath) {
        writeIndices(childDirPath, {

            exclude: [
                /\..*\.swp$/,
                /\..*\.swo$/,
            ],

        });
    });

}

function createPythonWrapper(modulePath) {

    var wrapper = new PythonWrapper(modulePath);
    try {
        fs.statSync(pyDestPath);
        return;
    } catch (err) {
        return wrapper.writeOutFile();
        // return fse.outputFileAsync(pyDestPath, output.join('\n'));
    }

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

function createWrapperFiles() {

    console.log('Creating wrapper files...');

    return new Promise(function(resolve, reject) {
    
        var promises = [];

        // trailing slash will match only directories
        var glob = new Glob('**/*.js', { 
            cwd: threeSrcDir, 
            nodir: true ,
            ignore: [
                '**/Three.Legacy.js',
                '**/renderers/**'
            ],
        })
            .on('match', function(match) {

                promises.push(createJavascriptWrapper(match));
                promises.push(createPythonWrapper(match));
                promises.push(createPythonModuleInitFile(match));

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

function createTopLevelFiles() {
    
    return Promise.all([
        createTopLevelPythonModuleFile(),
    ]);

}

if (require.main === module) {

    Promise.resolve(true)
        // .then(function() {
        //     return createDirectories()
        // })
        .then(function() {
            return createWrapperFiles();
        })
        .then(function() {
            return writeIndices(jsSrcDir, {
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

        })
        .then(function() {
            return createTopLevelFiles();
        })
        .then(function() {
            console.log('DONE');
        });

    // for each dir in three src
    //   create dir in src
    // for each file in three src
    //   create wrapper in src relative path to path in three src
    
}
