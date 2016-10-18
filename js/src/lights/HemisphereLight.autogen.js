//
// This file auto-generated with generate-wrappers.js
// Date: Tue Oct 18 2016 14:57:27 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;


var HemisphereLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'HemisphereLightView',
        _model_name: 'HemisphereLightModel',

        groundColor: "#000000",

    }),

    constructThreeObject: function() {

        return new THREE.HemisphereLight(
            this.get('color'),
            this.get('groundColor'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('groundColor');

    },

});

var HemisphereLightView = LightView.extend({});

module.exports = {
    HemisphereLightView: HemisphereLightView,
    HemisphereLightModel: HemisphereLightModel,
};
