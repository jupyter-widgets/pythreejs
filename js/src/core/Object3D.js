var _ = require('underscore');
var Object3DAutogen = require('./Object3D.autogen').Object3DModel;

var Object3DModel = Object3DAutogen.extend({

    onChildChanged: function(model, options) {
        if (model === this.get('parent')) {
            // Parent shouldn't be considered a child!
            return;
        }
        Object3DAutogen.prototype.onChildChanged.apply(this, arguments);

    },

});

module.exports = {
    Object3DModel: Object3DModel,
};
