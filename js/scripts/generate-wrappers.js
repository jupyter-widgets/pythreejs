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

function JavascriptWrapper(modulePath) {

    this.jsDestPath = path.resolve(jsSrcDir, modulePath);
    this.jsAutoDestPath = path.resolve(
        path.dirname(this.jsDestPath), 
        path.basename(this.jsDestPath, '.js') + '.' + AUTOGEN_EXT + '.js');

    this.className = path.basename(modulePath, '.js');
    this.config = getClassConfig(this.className);

    this.superDepModulePath = path.relative(
        path.dirname(this.jsDestPath), 
        path.resolve(jsSrcDir, this.config.superDepModulePath));
    
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
        body = body.concat(this.getModelOutput());
        body = body.concat(this.getViewOutput());
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
            "var THREE = require('three');",
        ];
    },

    getSuperclassRequire: function() {
        var superDepModulePath = path.relative(
            path.dirname(this.jsDestPath), 
            path.resolve(jsSrcDir, this.config.superDepModulePath));
    
        return [
            "var " + this.config.superDepModuleName + " = require('" + superDepModulePath + "');",
            "",
        ];
    },

    getDependencyRequires: function() {
        // TODO: implement
        return [];
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
        var modelSuperClassVarName = this.config.superDepModuleName + '.' + this.config.modelSuperClass;

        var serializedProperties = _.filter(_.keys(this.config.properties), function(propName) {
            return this.config.properties[propName].serialize;
        }, this);

        result = result.concat([
            "var " + this.config.modelName + " = " + modelSuperClassVarName + ".extend({",
            "    defaults: _.extend({}, " + modelSuperClassVarName + ".prototype.defaults, {",
            "        _view_name: '" + this.config.viewName + "'",
            "        _model_name: '" + this.config.modelName + "'",
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
            result.push("});", "");
        } else {
            result = result.concat(
                [ 
                    "}, {",
                    "    serializers: _.extend({",
                    
                ], 
                serializedProperties.map(function(propName) {
                    return "        " + propName + ": { seserialize: widgets.unpack_models },"
                }), 
                [ 
                    "    }, " + modelSuperClassVarName + ".serializers)",
                    "});",
                    "",
                ]
            );
        }

        return result;
    },

    getViewOutput: function() {

        var viewSuperClassVarName = this.config.superDepModuleName + '.' + this.config.viewSuperClass;
        var threeConstructorArgs = this.config.constructorArgs.map(function(propName) {
            return "this.model.get('" + propName + "')";
        });

        var result = [
            "var " + this.config.viewName + " = " + viewSuperClassVarName + ".extend({", 
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

        result = result.concat([
            "    },",
            "})",
            "",
        ]);

        return result;
    },

    writeOutFile: function() {
        return fse.outputFileAsync(this.getOutputFilename(), this.getOutput())
    },
});

function createJavascriptWrapper(modulePath) {

    try {
        fs.statSync(jsDestPath);
        return;
    } catch (err) {

        var wrapper = new JavascriptWrapper(modulePath);
        return wrapper.writeOutFile();

    }

}

function writeIndexForDir(dirPath, dirs, files, options) {

    options = (options == null) ? {} : options;

    var baseDirRetrace = path.relative(dirPath, jsSrcDir);

    var index = [
        "",
        "var loadedModules = [",
    ];

    if (options.header) {
        index = [ options.header ].concat(index);
    }

    files.forEach(function(filePath) {
        index.push("    require('./" + path.basename(path.basename(filePath, '.js'), '.autogen') + "'),");
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

    var dirname = path.dirname(modulePath);
    var basename = path.basename(modulePath, '.js');

    var pyOrigPath = path.resolve(pySrcDir, dirname, basename + '.py')
    var pyDestPath = path.resolve(pySrcDir, dirname, basename + '_' + AUTOGEN_EXT + '.py');

    var className = path.basename(modulePath, '.js');
    var config = getClassConfig(className);

    function relativePathToPythonImportPath(relativePath) {

        var tokens = relativePath.split(path.sep);
        var result = '.';

        console.log('path to py import: ' + relativePath);

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

    var output = [
        "from ipywidgets import Widget, DOMWidget, widget_serialization, Color",
        "from traitlets import Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool",
        "",
    ]

    if (config.pySuperModulePath) {
        var pySuperModulePath = path.relative(
            path.dirname(pyDestPath),
            path.resolve(pySrcDir, config.pySuperModulePath));
        pySuperModulePath = relativePathToPythonImportPath(pySuperModulePath);

        output = output.concat([
            "from " + pySuperModulePath + " import " + config.pySuperClass,
            "",
        ]);
    }
    
    output = output.concat([
        "class " + className + "(" + config.pySuperClass + ")" + ":",
        "    \"\"\"" + className,
        "    ",
        "    Autogenerated by " + path.basename(__filename),
        "    Date: " + new Date(),
        "    See http://threejs.org/docs/#Reference/" + modulePath,
        "    \"\"\"",
        "    ",
        "    _view_name = Unicode('" + className + "View').tag(sync=True)",
        "    _model_name = Unicode('" + className + "Model').tag(sync=True)",
        "    ",
    ])

    output = output.concat(_.map(config.properties, function(prop, propName) {

        var result = "    " + propName + " = " 

        // traitlet type
        result += prop.traitletType.replace(/%%default%%/g, JSON.stringify(prop.defaultValue));
        result += ".tag(sync=True";

        if (prop.serialize) {
            result += ", **widget_serialization" ;
        }
        result += ")";

        return result;
    }));

    output.push("");

    // TODO: properties plus serialization

    try {
        fs.statSync(pyOrigPath);
        return;
    } catch (err) {
        return fse.outputFileAsync(pyDestPath, output.join('\n'));
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
