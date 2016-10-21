//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:19 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var SphereGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'SphereGeometryView',
        _model_name: 'SphereGeometryModel',

        radius: 50,
        widthSegments: 8,
        heightSegments: 6,
        phiStart: 0,
        phiLength: 6.283185307179586,
        thetaStart: 0,
        thetaLength: 3.141592653589793,

    }),

    constructThreeObject: function() {

        return new THREE.SphereGeometry(
            this.get('radius'),
            this.get('widthSegments'),
            this.get('heightSegments'),
            this.get('phiStart'),
            this.get('phiLength'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['vertices'] = true;
        this.props_created_by_three['faces'] = true;
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radius'] = null;
        this.property_converters['widthSegments'] = null;
        this.property_converters['heightSegments'] = null;
        this.property_converters['phiStart'] = null;
        this.property_converters['phiLength'] = null;
        this.property_converters['thetaStart'] = null;
        this.property_converters['thetaLength'] = null;

    },

});

var SphereGeometryView = GeometryView.extend({});

module.exports = {
    SphereGeometryView: SphereGeometryView,
    SphereGeometryModel: SphereGeometryModel,
};
