
var Promise = require('bluebird');
var THREE = require('three');


function unpackThreeModel(value, manager) {
    var resolvePromisesDict = require('@jupyter-widgets/base/lib/utils').resolvePromisesDict;
    var unpacked;
    if (Array.isArray(value)) {
        unpacked = [];
        value.forEach(function(sub_value) {
            unpacked.push(unpackThreeModel(sub_value, manager));
        });
        return Promise.all(unpacked);
    } else if (value instanceof Object) {
        unpacked = {};
        Object.keys(value).forEach(function(key) {
            unpacked[key] = unpackThreeModel(value[key], manager);
        });
        return resolvePromisesDict(unpacked);
    } else if (typeof value === 'string' && value.slice(0, 10) === 'IPY_MODEL_') {
        // get_model returns a promise already
        return manager.get_model(value.slice(10, value.length)).then(function (model) {
            return model.initPromise.then(function() {
                return model;
            });
        });
    } else {
        return Promise.resolve(value);
    }
}


function unpackThreeObj(value, manager) {
    var resolvePromisesDict = require('@jupyter-widgets/base/lib/utils').resolvePromisesDict;
    var unpacked;
    if (Array.isArray(value)) {
        unpacked = [];
        value.forEach(function(sub_value) {
            unpacked.push(unpackThreeObj(sub_value, manager));
        });
        return Promise.all(unpacked);
    } else if (value instanceof Object) {
        unpacked = {};
        Object.keys(value).forEach(function(key) {
            unpacked[key] = unpackThreeObj(value[key], manager);
        });
        return resolvePromisesDict(unpacked);
    } else if (typeof value === 'string' && value.slice(0, 10) === 'IPY_MODEL_') {
        // get_model returns a promise already
        return manager.get_model(value.slice(10, value.length)).then(function (model) {
            return model.initPromise.then(function() {
                return model.obj;
            });
        });
    } else {
        return Promise.resolve(value);
    }
}

function serializeUniforms(uniforms) {

    var serialized = {};

    for ( var name in uniforms ) {

        var uniform = uniforms[ name ];
        var value = uniform.value;

        if ( value === null) {

            serialized[ name ] = { value: null };

        } else if ( value.isTexture ) {

            serialized[ name ] = {
                type: 't',
                value: value.ipymodelId
            };

        } else if ( value.isColor ) {

            serialized[ name ] = {
                type: 'c',
                value: '#' + value.getHexString()
            };

        } else if ( value.isVector2 ) {

            serialized[ name ] = {
                type: 'v2',
                value: value.toArray()
            };

        } else if ( value.isVector3 ) {

            serialized[ name ] = {
                type: 'v3',
                value: value.toArray()
            };

        } else if ( value.isVector4 ) {

            serialized[ name ] = {
                type: 'v4',
                value: value.toArray()
            };

        } else if ( value.isMatrix3 ) {

            serialized[ name ] = {
                type: 'm3',
                value: value.toArray()
            };

        } else if ( value.isMatrix4 ) {

            serialized[ name ] = {
                type: 'm4',
                value: value.toArray()
            };

        } else {

            serialized[ name ] = {
                value: value
            };

            // note: the array variants v2v, v3v, v4v, m4v and tv are not supported so far

        }

    }

    return serialized;

}


function deserializeUniforms(serialized, manager) {
    var uniforms = {};
    var refs = [];

    for ( var name in serialized ) {

        var uniform = serialized[ name ];
        var value = uniform.value;

        switch (uniform.type) {

        case 't':
            refs.push(unpackThreeObj(value, manager).then(function(obj) {
                uniforms[ name ] = { value: obj };
            }));
            break;

        case 'c':
            uniforms[ name ] = { value: new THREE.Color().set( uniform.value ) };
            break;

        case 'v2':
            uniforms[ name ] = { value: new THREE.Vector2().fromArray( uniform.value ) };
            break;

        case 'v3':
            uniforms[ name ] = { value: new THREE.Vector3().fromArray( uniform.value ) };
            break;

        case 'v4':
            uniforms[ name ] = { value: new THREE.Vector4().fromArray( uniform.value ) };
            break;

        case 'm3':
            uniforms[ name ] = { value: new THREE.Matrix3().fromArray( uniform.value ) };
            break;

        case 'm4':
            uniforms[ name ] = { value: new THREE.Matrix4().fromArray( uniform.value ) };
            break;

        default:
            uniforms[ name ] = { value: uniform.value };

        }

    }

    // Resolve any widget refs
    return Promise.all(refs).then(function() {
        return uniforms;
    });
}


module.exports = {
    serializeUniforms: serializeUniforms,
    deserializeUniforms: deserializeUniforms,
    unpackThreeModel: unpackThreeModel,
    unpackThreeObj: unpackThreeObj,
};
