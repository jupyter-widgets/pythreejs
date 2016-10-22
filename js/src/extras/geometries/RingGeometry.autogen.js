//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var RingGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'RingGeometryView',
        _model_name: 'RingGeometryModel',

        innerRadius: 0,
        outerRadius: 50,
        thetaSegments: 8,
        phiSegments: 8,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.RingGeometry(
            this.get('innerRadius'),
            this.get('outerRadius'),
            this.get('thetaSegments'),
            this.get('phiSegments'),
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

        this.property_converters['innerRadius'] = null;
        this.property_converters['outerRadius'] = null;
        this.property_converters['thetaSegments'] = null;
        this.property_converters['phiSegments'] = null;
        this.property_converters['thetaStart'] = null;
        this.property_converters['thetaLength'] = null;

    },

});

var RingGeometryView = GeometryView.extend({});

module.exports = {
    RingGeometryView: RingGeometryView,
    RingGeometryModel: RingGeometryModel,
};
