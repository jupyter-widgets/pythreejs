var Promise = require('bluebird');
var THREE = require('three');
var CubeTextureBase = require('./CubeTexture.autogen');

var CubeTextureModel = CubeTextureBase.CubeTextureModel.extend({

    constructThreeObjectAsync: function() {

        var loader = new THREE.CubeTextureLoader();
        // Ensure we resolve any local paths according to current notebook location:
        // resolveUrl
        // var imageUriPromise = this.widget_manager.resolveUrl(this.get('imageUri'));

        const imagesUri = this.get('imagesUri');
        // loader.load(
        //     imagesUri,
        //     function(texture) {
        //         return texture;
        //     },
        //     function(xhr) {
        //         console.debug(imagesUri + ': ' + (xhr.loaded / xhr.total * 100) + '%');
        //     },
        //     function(xhr) {
        //         console.log('Error loading texture: ' + imagesUri);
        //         return reject(new Error(xhr));
        //     }
        // )

        var p = new Promise(function(resolve, reject) {
            loader.load(
                imagesUri,
                function(texture) {
                    return resolve(texture);
                },
                function(xhr) {
                    console.debug(imagesUri + ': ' + (xhr.loaded / xhr.total * 100) + '%');
                },
                function(xhr) {
                    console.log('Error loading texture: ' + imagesUri);
                    return reject(new Error(xhr));
                }
            )
        });
        return p;
    },

});

module.exports = {
    CubeTextureModel: CubeTextureModel,
};
