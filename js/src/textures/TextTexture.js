var Promise = require('bluebird');
var THREE = require('three');
var TextTextureBase = require('./TextTexture.autogen').TextTextureModel;

class TextTextureModel extends TextTextureBase {

    constructThreeObjectAsync() {

        var self = this;

        var p = new Promise(function(resolve, reject) {
            var canvas = self.buildCanvas();
            return resolve(new THREE.CanvasTexture(canvas));
        });
        return p;
    }

    // push data from model to three object
    syncToThreeObj(force) {
        TextTextureBase.prototype.syncToThreeObj.apply(this, arguments);

        // TODO: Use mapping of relevant properties instead of sync?
        var canvas = this.buildCanvas();
        this.obj.image = canvas;
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
        this.save_changes();
    }

    buildCanvas() {
        var fontFace = this.get('fontFace');
        var size = this.get('size');
        var color = this.get('color');
        var string = this.get('string');

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        // Pad size with two to avoid edge artifacts when interpolating
        canvas.height = size + 2;
        var font = 'Normal ' + size + 'px ' + fontFace;
        context.font = font;

        var metrics = context.measureText(string);
        var textWidth = Math.ceil(metrics.width) + 2;
        canvas.width = textWidth;

        if (this.get('squareTexture')) {
            canvas.height = canvas.width = Math.max(canvas.width, canvas.height);
        }

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = color;
        // Must set the font again for the fillText call
        context.font = font;
        context.fillText(string, canvas.width / 2, canvas.height / 2);
        return canvas;
    }

}

module.exports = {
    TextTextureModel: TextTextureModel,
};
