var _ = require('underscore');
var BlackboxAutogen = require('./Blackbox.autogen').BlackboxModel;

var BlackboxModel = Object3DModel.extend({

    defaults: function() {
        var superdef = Object3DModel.prototype.defaults.call(this);
        delete superdef['children'];
        return superdef;
    },


    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);
        delete this.three_array_properties['children'];
        delete this.property_converters['children'];

    }

});