//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
                color: this.convertColorModelToThree(this.get('color'), 'color'),
                linewidth: this.get('linewidth'),
                scale: this.get('scale'),
                dashSize: this.get('dashSize'),
                gapSize: this.get('gapSize'),
                vertexColors: this.convertEnumModelToThree(this.get('vertexColors'), 'vertexColors'),
            }
        );

    },

    createPropertiesArrays: function() {

        MaterialModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;
        this.enum_property_types['vertexColors'] = 'Colors';

        this.property_converters['color'] = 'convertColor';
        this.property_converters['linewidth'] = null;
        this.property_converters['scale'] = null;
        this.property_converters['dashSize'] = null;
        this.property_converters['gapSize'] = null;
        this.property_converters['vertexColors'] = 'convertEnum';

    },

});

var LineDashedMaterialView = MaterialView.extend({});

module.exports = {
    LineDashedMaterialView: LineDashedMaterialView,
    LineDashedMaterialModel: LineDashedMaterialModel,
};
