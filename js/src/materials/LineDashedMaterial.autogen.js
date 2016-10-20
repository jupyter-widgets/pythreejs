//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var MaterialModel = require('./Material').MaterialModel;
var MaterialView = require('./Material').MaterialView;


var LineDashedMaterialModel = MaterialModel.extend({

    defaults: _.extend({}, MaterialModel.prototype.defaults, {

        _view_name: 'LineDashedMaterialView',
        _model_name: 'LineDashedMaterialModel',

        color: "#ffffff",
        linewidth: 1,
        scale: 1,
        dashSize: 3,
        gapSize: 1,
        vertexColors: "NoColors",

    }),

    constructThreeObject: function() {

        return new THREE.LineDashedMaterial(
            {
                color: this.get('color'),
                linewidth: this.get('linewidth'),
                scale: this.get('scale'),
                dashSize: this.get('dashSize'),
                gapSize: this.get('gapSize'),
                vertexColors: this.get('vertexColors'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        this.color_properties.push('color');
        this.scalar_properties.push('linewidth');
        this.scalar_properties.push('scale');
        this.scalar_properties.push('dashSize');
        this.scalar_properties.push('gapSize');
        this.enum_properties.push('vertexColors');
        this.enum_property_types['vertexColors'] = 'Colors';

    },

});

var LineDashedMaterialView = MaterialView.extend({});

module.exports = {
    LineDashedMaterialView: LineDashedMaterialView,
    LineDashedMaterialModel: LineDashedMaterialModel,
};
