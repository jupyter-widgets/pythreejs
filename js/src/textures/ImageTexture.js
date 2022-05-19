var Promise = require('bluebird');
var THREE = require('three');
var ImageTextureBase = require('./ImageTexture.autogen');

class ImageTextureModel extends ImageTextureBase.ImageTextureModel {

    constructThreeObjectAsync() {

        var loader = new THREE.TextureLoader();
        // Ensure we resolve any local paths according to current notebook location:
        var imageUriPromise = this.widget_manager.resolveUrl(this.get('imageUri'));

        var p = new Promise(function(resolve, reject) {
            imageUriPromise.then(function (imageUri) {
                loader.load(
                    imageUri,
                    function(texture) {
                        return resolve(texture);
                    },
                    function(xhr) {
                        console.debug(imageUri + ': ' + (xhr.loaded / xhr.total * 100) + '%');
                    },
                    function(xhr) {
                        console.log('Error loading texture: ' + imageUri);
                        return reject(new Error(xhr));
                    }
                );
            }, reject);
        });
        return p;
    }

}

module.exports = {
    ImageTextureModel: ImageTextureModel,
};
