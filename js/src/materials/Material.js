var _ = require('underscore');
var MaterialAutogen = require('./Material.autogen').MaterialModel;

var MaterialModel = MaterialAutogen.extend({

    onCustomMessage: function(content, buffers) {
        switch(content.type) {
            case 'needsUpdate':
                this.obj.needsUpdate = true;
                this.trigger('childchange', this);
                break;
            default:
                MaterialAutogen.prototype.onCustomMessage.call(arguments);

        }
    },

});

module.exports = {
    MaterialModel: MaterialModel,
};
