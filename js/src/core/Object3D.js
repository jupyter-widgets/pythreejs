var _ = require('underscore');
var Object3DAutogen = require('./Object3D.autogen');

var Object3DModel = Object3DAutogen.Object3DModel.extend({

    onChildChanged: function(model, options) {
        if (model === this.get('parent')) {
            // Parent shouldn't be considered a child!
            return;
        }
        Object3DAutogen.Object3DModel.prototype.onChildChanged.apply(this, arguments);

    },

});

module.exports = {
    Object3DModel: Object3DModel,
};
