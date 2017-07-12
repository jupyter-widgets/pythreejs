var _ = require('underscore');
var Promise = require('bluebird');
var ImageTextureBase = require('./ImageTexture.autogen');

var ImageTextureModel = ImageTextureBase.ImageTextureModel.extend({

    constructThreeObjectAsync: function() {

        var loader = new THREE.TextureLoader();
        var imageUri = this.get('imageUri');

        var p = new Promise(function(resolve, reject) {
            loader.load(
                imageUri,
                function(texture) {
                    return resolve(texture);
                },
                function(xhr) {
                    console.log(imageUri + ': ' + (xhr.loaded / xhr.total * 100) + '%');
                },
                function(xhr) {
                    console.log('Error loading texture: ' + imageUri);
                    return reject(texture);
                }
            );
        });
        return p;
    },

});

module.exports = {
    ImageTextureModel: ImageTextureModel,
};
