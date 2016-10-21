//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
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
                color: this.convertColorModelToThree(this.get('color'), 'color'),
                linewidth: this.get('linewidth'),
                linecap: this.get('linecap'),
                linejoin: this.get('linejoin'),
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
        this.property_converters['linecap'] = null;
        this.property_converters['linejoin'] = null;
        this.property_converters['vertexColors'] = 'convertEnum';

    },

});

var LineBasicMaterialView = MaterialView.extend({});

module.exports = {
    LineBasicMaterialView: LineBasicMaterialView,
    LineBasicMaterialModel: LineBasicMaterialModel,
};
