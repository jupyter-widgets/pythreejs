var path = require('path');

var Promise = require('bluebird');
var Glob = require('glob').Glob;
var fse = require('fs-extra');

Promise.promisifyAll(fse);

var scriptDir = __dirname;
var baseDir = path.resolve(scriptDir, '..');

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

        // trailing slash will match only directories
        var glob = new Glob(globPattern, globOptions)
            .on('match', function(match) {
                var result = mapFn(match);
                if (result instanceof Array) {
                    promises = promises.concat(result);
                } else if (result instanceof Promise) {
                    promises.push(result);
                } else {
                	promises.push(Promise.resolve(result));
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

function rmFileGlobAsync(globPattern) {
	return mapPromiseFnOverGlob(globPattern, function(filePath) {
		console.log(filePath);
		var absPath = path.resolve(baseDir, filePath);
		return fse.removeAsync(absPath);
	}, { 
        cwd: baseDir, 
        nodir: true,
        ignore: [
        	'./node_modules/**'
        ]
    });
}

function cleanGeneratedFilesAsync() {
	// trailing slash will match only directories
	var jsPromise = rmFileGlobAsync('./**/*.autogen.js');
	var jsIndexPromise = rmFileGlobAsync('./**/index.js');

	var pyPromise = rmFileGlobAsync('../pythreejs/**/*_autogen.py');
	var pyIndexPromise = rmFileGlobAsync('../pythreejs/**/__init__.py');

	return Promise.all([
		jsPromise,
		jsIndexPromise,
		pyPromise,
		pyIndexPromise,
	]);
}

if (require.main === module) {
    cleanGeneratedFilesAsync().then(function() {
        console.log('DONE');
    });
}