//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
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
        this.scalar_properties.push('radius');
        this.scalar_properties.push('widthSegments');
        this.scalar_properties.push('heightSegments');
        this.scalar_properties.push('phiStart');
        this.scalar_properties.push('phiLength');
        this.scalar_properties.push('thetaStart');
        this.scalar_properties.push('thetaLength');

    },

});

var SphereBufferGeometryView = BufferGeometryView.extend({});

module.exports = {
    SphereBufferGeometryView: SphereBufferGeometryView,
    SphereBufferGeometryModel: SphereBufferGeometryModel,
};
