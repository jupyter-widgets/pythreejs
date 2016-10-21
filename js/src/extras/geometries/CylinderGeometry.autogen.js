//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var GeometryModel = require('../../core/Geometry').GeometryModel;
var GeometryView = require('../../core/Geometry').GeometryView;


var CylinderGeometryModel = GeometryModel.extend({

    defaults: _.extend({}, GeometryModel.prototype.defaults, {

        _view_name: 'CylinderGeometryView',
        _model_name: 'CylinderGeometryModel',

        radiusTop: 20,
        radiusBottom: 20,
        height: 100,
        radiusSegments: 8,
        heightSegments: 1,
        openEnded: false,
        thetaStart: 0,
        thetaLength: 6.283185307179586,

    }),

    constructThreeObject: function() {

        return new THREE.CylinderGeometry(
            this.get('radiusTop'),
            this.get('radiusBottom'),
            this.get('height'),
            this.get('radiusSegments'),
            this.get('heightSegments'),
            this.get('openEnded'),
            this.get('thetaStart'),
            this.get('thetaLength')
        );

    },

    createPropertiesArrays: function() {

        GeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['radiusTop'] = null;
        this.property_converters['radiusBottom'] = null;
        this.property_converters['height'] = null;
        this.property_converters['radiusSegments'] = null;
        this.property_converters['heightSegments'] = null;
        this.property_converters['openEnded'] = null;
        this.property_converters['thetaStart'] = null;
        this.property_converters['thetaLength'] = null;

    },

});

var CylinderGeometryView = GeometryView.extend({});

module.exports = {
    CylinderGeometryView: CylinderGeometryView,
    CylinderGeometryModel: CylinderGeometryModel,
};
