//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var BufferGeometryModel = require('../../core/BufferGeometry').BufferGeometryModel;
var BufferGeometryView = require('../../core/BufferGeometry').BufferGeometryView;


var SphereBufferGeometryModel = BufferGeometryModel.extend({

    defaults: _.extend({}, BufferGeometryModel.prototype.defaults, {

        _view_name: 'SphereBufferGeometryView',
        _model_name: 'SphereBufferGeometryModel',

        radius: 50,
        widthSegments: 8,
        heightSegments: 6,
        phiStart: 0,
        phiLength: 6.283185307179586,
        thetaStart: 0,
        thetaLength: 3.141592653589793,

    }),

    constructThreeObject: function() {

        return new THREE.SphereBufferGeometry(
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

        BufferGeometryModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['attributes'] = true;
        this.props_created_by_three['index'] = true;
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

var SphereBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    SphereBufferGeometryView: SphereBufferGeometryView,
    SphereBufferGeometryModel: SphereBufferGeometryModel,
};
