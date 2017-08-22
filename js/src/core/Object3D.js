var _ = require('underscore');
var Object3DAutogen = require('./Object3D.autogen').Object3DModel;

var Object3DModel = Object3DAutogen.extend({

    createPropertiesArrays: function() {
        Object3DAutogen.prototype.createPropertiesArrays.call(this);

        this.property_assigners['children'] = 'assignChildren';
    },

    onChildChanged: function(model, options) {
        if (model === this.get('parent')) {
            // Parent shouldn't be considered a child!
            return;
        }
        Object3DAutogen.prototype.onChildChanged.apply(this, arguments);

    },

    assignChildren: function(obj, key, value) {
        old = obj[key];
        removed = _.difference(old, value);
        added = _.difference(value, old);
        if (removed.length > 0) {
            obj.remove(...removed);
        }
        if (added.length > 0) {
            obj.add(...added);
        }
    }

});

module.exports = {
    Object3DModel: Object3DModel,
};
