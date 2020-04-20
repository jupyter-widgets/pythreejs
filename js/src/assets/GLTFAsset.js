var Promise = require('bluebird');
var GLTFAssetBase = require('./GLTFAsset.autogen');

var widgets = require('@jupyter-widgets/base');

// HACK: examples expect THREE in globals
global.THREE = require('three');

require('three/examples/js/loaders/GLTFLoader.js');

var THREE = require('three');

var GLTFAssetModel = GLTFAssetBase.GLTFAssetModel.extend({
    constructThreeObjectAsync: function() {
        var manager = THREE.DefaultLoadingManager;
        var loader = new THREE.GLTFLoader(manager);
        // Ensure we resolve any local paths according to current notebook location:
        var gltfUriPromise = this.widget_manager.resolveUrl(this.get('gltfUri'));

        var p = new Promise(function(resolve, reject) {
            gltfUriPromise.then(function (gltfUri) {
                loader.load(
                    gltfUri,
                    function(gltf) {
                        console.debug('Successfully loaded ' + gltfUri);
                        return resolve(gltf);
                    },
                    function(xhr) {
                        console.debug(gltfUri + ': ' + (xhr.loaded / xhr.total * 100) + '%');
                    },
                    function(xhr) {
                        console.log('Error loading GLTF: ' + gltfUri);
                        return reject(new Error(xhr));
                    }
                );
            }, reject);
        });
        return p.bind(this).then(function(gltf) {
            this.set({ scene: gltf.scene }, 'pushFromThree');
            return gltf;
        });
        
    },

});

module.exports = {
    GLTFAssetModel: GLTFAssetModel,
};
