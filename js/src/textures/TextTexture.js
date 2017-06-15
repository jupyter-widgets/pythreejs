var _ = require('underscore');
var Promise = require('bluebird');
var TextTextureBase = require('./TextTexture.autogen').TextTextureModel;

var TextTextureModel = TextTextureBase.extend({

    constructThreeObjectAsync: function() {

        var self = this;

        var p = new Promise(function(resolve, reject) {
            var canvas = self.buildCanvas();
            return resolve(new THREE.CanvasTexture(canvas));
        });
        return p;
    },

    // push data from model to three object
    syncToThreeObj: function() {
        TextTextureBase.prototype.syncToThreeObj.call(this);

        // TODO: Use mapping of relevant properties instead of sync?
        var canvas = this.buildCanvas();
        this.obj.image = canvas;
        this.obj.needsUpdate = true;
        this.set({ version: this.obj.version }, 'pushFromThree');
    },

    buildCanvas: function() {
        var fontFace = this.get('fontFace');
        var size = this.get('size');
        var color = this.get('color');
        var string = this.get('string');

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.height = size;
        var font = 'Normal ' + size + 'px ' + fontFace;
        context.font = font;

        var metrics = context.measureText(string);
        var textWidth = Math.ceil(metrics.width);
        canvas.width = textWidth;

        if (this.get('squareTexture')) {
            canvas.height = canvas.width;
        }

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = color;
        // Must set the font again for the fillText call
        context.font = font;
        context.fillText(string, canvas.width / 2, canvas.height / 2);
        return canvas
    }

});

module.exports = {
    TextTextureModel: TextTextureModel,
};
