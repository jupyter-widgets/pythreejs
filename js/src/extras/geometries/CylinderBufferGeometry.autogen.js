//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var CylinderBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'CylinderBufferGeometryView',
        _model_name: 'CylinderBufferGeometryModel',

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

        return new THREE.CylinderBufferGeometry(
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

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
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

var CylinderBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    CylinderBufferGeometryView: CylinderBufferGeometryView,
    CylinderBufferGeometryModel: CylinderBufferGeometryModel,
};
