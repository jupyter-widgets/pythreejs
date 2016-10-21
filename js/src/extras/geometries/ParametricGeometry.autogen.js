//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var ParametricGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'ParametricGeometryView',
        _model_name: 'ParametricGeometryModel',

        func: function (u,v) { return THREE.Vector3(); },
        slices: 3,
        stacks: 3,

    }),

    constructThreeObject: function() {

        return new THREE.ParametricGeometry(
            this.convertFunctionModelToThree(this.get('func'), 'func'),
            this.get('slices'),
            this.get('stacks')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['func'] = 'convertFunction';
        this.property_converters['slices'] = null;
        this.property_converters['stacks'] = null;

    },

});

var ParametricGeometryView = GeometryView.extend({});

module.exports = {
    ParametricGeometryView: ParametricGeometryView,
    ParametricGeometryModel: ParametricGeometryModel,
};
