var _ = require('underscore');
var BlackboxAutogen = require('./Blackbox.autogen').BlackboxModel;

var BlackboxModel = BlackboxAutogen.extend({

    defaults: function() {
        var superdef = BlackboxAutogen.prototype.defaults.call(this);
        delete superdef['children'];
        return superdef;
    },


    createPropertiesArrays: function() {

        BlackboxAutogen.prototype.createPropertiesArrays.call(this);
        delete this.three_array_properties['children'];
        delete this.property_converters['children'];

    }

});