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
    var result = classConfigs[className.replace(/\./g, '_')];
    _.defaults(
        result, 
        {
            viewName: className + 'View',
            modelName: className + 'Model',
        },
        classConfigs._defaults
    );

    return result;
}

function relativePathToPythonImportPath(relativePath) {

    var tokens = relativePath.split(path.sep);
    var result = '.';

    // console.log('path to py import: ' + relativePath);

    result += tokens.map(function(token) {
        if (token === '.') {
            return null;
        } else if (token === '..') {
            return '';
        } else {
            return token;
        }
    })
        .filter(function(v) { return v != null; })
        .join('.');

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
            "",
        ];
    },

    getSuperclassRequire: function() {
    
        return [
            this.getDependencyRequireLine({
                relativePath: this.config.superDepModulePath,
                className: this.config.modelSuperClass
            }),
            this.getDependencyRequireLine({
                relativePath: this.config.superDepModulePath,
                className: this.config.viewSuperClass
            }),
            "",
        ];
    },

    getDependencyRequires: function() {
        var deps = this.config.dependencies || [];
        return deps.map(function(dep) {
            return this.getDependencyRequireLine(dep);
        }, this);
    },

    getDependencyRequireLine: function(dep) {

        var className;
        var relativePath;

        if (typeof dep === 'string') {

            var depConfig = getClassConfig(dep);
            className = dep;
            relativePath = path.join(depConfig.relativePath, className);
        
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
            "    " + this.config.viewName + ": " + this.config.viewName + ",",
            "    " + this.config.modelName + ": " + this.config.modelName + ",",
            "};",
            "",
        ]
    },

    getModelOutput: function() {
        var result = [];

        var serializedProperties = _.filter(_.keys(this.config.properties), function(propName) {
            return this.config.properties[propName].serialize;
        }, this);

        result = result.concat([
            "var " + this.config.modelName + " = " + this.config.modelSuperClass + ".extend({",
            "    defaults: _.extend({}, " + this.config.modelSuperClass + ".prototype.defaults, {",
            "        _view_name: '" + this.config.viewName + "',",
            "        _model_name: '" + this.config.modelName + "',",
            "",
        ]);

        result = result.concat(_.map(this.config.properties, function(prop, propName) {
            return "        " + propName + ": " + JSON.stringify(prop.defaultValue) + ",";
        }));

        result = result.concat([
            "    }),",
        ]);

        // TODO: property defaults

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
                    "    }, " + this.config.modelSuperClass + ".serializers)",
                    "});",
                    "",
                    "",
                ]
            );
        }

        return result;
    },

    getViewOutput: function() {

        var threeConstructorArgs = this.config.constructorArgs.map(function(propName) {
            return "this.model.get('" + propName + "')";
        });

        // new_obj()
        var result = [
            "var " + this.config.viewName + " = " + this.config.viewSuperClass + ".extend({", 
            "    new_obj: function() {",
        ];

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
            "    new_properties: function() {",
            "        " + this.config.viewSuperClass + ".prototype.new_properties.call(this);"
        );

        result = result.concat(_.map(this.config.properties, function(prop, propName) {
            var propType = prop.propertyType || 'scalar';
            return "        this." + propType + "_properties.push('" + propName + "');";
        }));

        result.push(
            "    },",
            ""
        );

        result = result.concat([ "})", "", "" ]);
        return result;
    },

    getCustomImplementationOverrideOutput: function() {

        // check if manual file exists
        var customSrcPath = this.jsDestPath;

        var overrideModule = "Override";
        var overrideModel = overrideModule + "." + this.config.modelName;
        var overrideView = overrideModule + "." + this.config.viewName;

        if (!fs.existsSync(customSrcPath)) {
            return [];
        }    

        return [
            "// Override auto-gen class with custom implementation",
            "var " + overrideModule + " = require('./" + this.className + ".js');",
            "_.extend(" + this.config.modelName + ".prototype, " + overrideModel + ".prototype);",
            "_.extend(" + this.config.modelName + ", " + overrideModel + ");", 
            "_.extend(" + this.config.viewName + ".prototype, " + overrideView + ".prototype);",
            "_.extend(" + this.config.viewName + ", " + overrideView + ");",
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

    this.className = basename; 
    this.modulePath = modulePath;

    this.destDir = path.resolve(pySrcDir, dirname);

    this.pyDestPath = path.resolve(this.destDir, basename + '.py')
    this.pyAutoDestPath = path.resolve(this.destDir, basename + '_' + AUTOGEN_EXT + '.py');

    this.config = getClassConfig(this.className);

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
        return [
            "from ipywidgets import Widget, DOMWidget, widget_serialization, Color",
            "from traitlets import Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool",
            "",
        ];
    },

    getSuperclassRequire: function() {

        if (this.config.pySuperModulePath) {

            return [
                this.getDependencyRequireLine({ 
                    relativePath: this.config.pySuperModulePath, 
                    className: this.config.pySuperClass 
                }),
                "",
            ];
        } else {
            return [];
        }

    },

    getDependencyRequires: function() {

        if (!this.config.dependencies) { 
            return []; 
        }

        return this.config.dependencies.map(function(dep) {
            return this.getDependencyRequireLine(dep, this.destDir);
        }, this);
    },  

    getDependencyRequireLine: function(dep) {

        var className;
        var relativePath;

        if (typeof dep === 'string') {

            var className = dep;
            var depConfig = getClassConfig(className);
            var relativePath = path.join(depConfig.relativePath, className);
    
        } else if (typeof dep === 'object') {

            className = dep.className;
            relativePath = dep.relativePath;
    
        } else {
            throw new Error('invalid dep: ' + dep);
        }

        console.log(this.destDir);
        console.log(relativePath);

        // get path of dependency relative to module dir
        relativePath = path.resolve(pySrcDir, relativePath);
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
            "class " + this.className + "(" + this.config.pySuperClass + ")" + ":",
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

            var result = "    " + propName + " = " 
            var traitletDefaultValue = JSON.stringify(prop.defaultValue);

            // traitlet type
            result += prop.traitletType.replace(/%%default%%/g, traitletDefaultValue);

            // traitlet tag
            result += ".tag(sync=True";
            if (prop.serialize) {
                result += ", **widget_serialization" ;
            }
            result += ")";

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

    options = (options == null) ? {} : options;

    var baseDirRetrace = path.relative(dirPath, jsSrcDir);

    var index = [
        "var loadedModules = [",
    ];

    if (options.header) {
        index = [ options.header ].concat(index);
    }

    files.forEach(function(filePath) {
        if (/\.autogen\.js$/.test(filePath)) {
            index.push("    require('./" + path.basename(filePath, '.autogen.js') + "'),");
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

    options = (options == null) ? {} : options;

    dirFiles = fs.readdirSync(dirPath).map(function(filename) {
        return path.join(dirPath, filename);
    });
    dirFiles = dirFiles.filter(function(filePath) {
        var fileName = path.basename(filePath);
        return !/\.swp$/.test(filePath)
            && !/index\.js$/.test(filePath)
            && !/_.*/.test(fileName);
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
                var moduleName = path.basename(match, '.py');

                console.log(modulePath + ' ' + moduleName);

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
        var glob = new Glob('**/*.js', { cwd: threeSrcDir, nodir: true })
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
                    './base.js', // required in by modules that need it
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
                ].join('\n'),
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
