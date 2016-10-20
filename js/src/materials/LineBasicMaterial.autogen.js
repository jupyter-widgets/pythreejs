//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;


var LineBasicMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'LineBasicMaterialView',
        _model_name: 'LineBasicMaterialModel',

        color: "#ffffff",
        linewidth: 1,
        linecap: "round",
        linejoin: "round",
        vertexColors: "NoColors",

    }),

    constructThreeObject: function() {

        return new THREE.LineBasicMaterial(
            {
                color: this.get('color'),
                linewidth: this.get('linewidth'),
                linecap: this.get('linecap'),
                linejoin: this.get('linejoin'),
                vertexColors: this.get('vertexColors'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('color');
        this.scalar_properties.push('linewidth');
        this.scalar_properties.push('linecap');
        this.scalar_properties.push('linejoin');
        this.enum_properties.push('vertexColors');
        this.enum_property_types['vertexColors'] = 'Colors';

    },

});

var LineBasicMaterialView = MaterialView.extend({});

module.exports = {
    LineBasicMaterialView: LineBasicMaterialView,
    LineBasicMaterialModel: LineBasicMaterialModel,
};
