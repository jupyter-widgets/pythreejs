//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var DodecahedronGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'DodecahedronGeometryView',
        _model_name: 'DodecahedronGeometryModel',

        radius: 1,
        detail: 0,

    }),

    constructThreeObject: function() {

        return new THREE.DodecahedronGeometry(
            this.get('radius'),
            this.get('detail')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['detail'] = null;

    },

});

var DodecahedronGeometryView = GeometryView.extend({});

module.exports = {
    DodecahedronGeometryView: DodecahedronGeometryView,
    DodecahedronGeometryModel: DodecahedronGeometryModel,
};
