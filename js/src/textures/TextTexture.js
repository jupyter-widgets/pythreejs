var _ = require('underscore');
var Promise = require('bluebird');
var TextTextureBase = require('./TextTexture.autogen');

var TextTextureModel = TextTextureBase.TextTextureModel.extend({

    // TODO: Replace sync function

    constructThreeObjectAsync: function() {

        var fontFace = this.get('fontFace');
        var size = this.get('size');
        var color = this.get('color');
        var string = this.get('string');

        var self = this;

        var p = new Promise(function(resolve, reject) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            canvas.height = size;
            var font = 'Normal ' + size + 'px ' + fontFace;
            context.font = font;

            var metrics = context.measureText(string);
            var textWidth = metrics.width;
            canvas.width = textWidth;

            if (self.get('squareTexture')) {
                canvas.height = canvas.width;
            }

            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = color;
            // Must set the font again for the fillText call
            context.font = font;
            context.fillText(string, canvas.width / 2, canvas.height / 2);

            return resolve(new THREE.CanvasTexture(canvas));
        });
        return p;
    },

});

module.exports = {
    TextTextureModel: TextTextureModel,
};
