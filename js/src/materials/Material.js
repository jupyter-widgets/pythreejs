var MaterialAutogen = require('./Material.autogen').MaterialModel;

class MaterialModel extends MaterialAutogen {

    onCustomMessage(content, buffers) {
        switch(content.type) {
        case 'needsUpdate':
            this.obj.needsUpdate = true;
            this.trigger('childchange', this);
            break;
        default:
            MaterialAutogen.prototype.onCustomMessage.call(arguments);
        }
    }

}

module.exports = {
    MaterialModel: MaterialModel,
};
