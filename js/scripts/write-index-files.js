
var path = require('path');
var fs = require('fs');

var scriptDir = __dirname;
var baseDir = path.resolve(scriptDir, '..');
var srcDir = path.resolve(baseDir, 'src/');

function isFile(filePath) {
    var stats = fs.statSync(filePath);
    return stats.isFile();
}

function isDir(filePath) {
    var stats = fs.statSync(filePath);
    return stats.isDirectory();
}

function writeIndexForDir(dirPath, dirs, files, options) {

    options = (options == null) ? {} : options;

    var baseDirRetrace = path.relative(dirPath, srcDir);

    var index = [
        "",
        "var loadedModules = [",
    ];

    if (options.header) {
        index = [ options.header ].concat(index);
    }

    files.forEach(function(filePath) {
        index.push("    require('./" + path.basename(filePath, '.js') + "'),");
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
            var relPath = './' + path.relative(srcDir, filePath);
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

if (require.main === module) {

    writeIndices(srcDir, {

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

}
