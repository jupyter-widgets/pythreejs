//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('./../_base/Three').ThreeModel;
var ThreeView = require('./../_base/Three').ThreeView;

var WebGLRendererModel = ThreeModel.extend({
    defaults: _.extend({}, ThreeModel.prototype.defaults, {
        _view_name: 'WebGLRendererView',
        _model_name: 'WebGLRendererModel',

        width: 200,
        height: 200,
        autoClear: true,
        autoClearColor: true,
        autoClearDepth: true,
        autoClearStencil: true,
        sortObject: true,
        clippingPlanes: null,
        localClippingEnabled: false,
        gammaFactor: 2.0,
        gammaInput: false,
        gammaOutput: false,
        physicallyCorrectLights: false,
        toneMappingExposure: 1.0,
        toneMappingWhitePoint: 1.0,
        maxMorphTargets: 8,
        maxMorphNormals: 4,
        // TODO:
        // toneMapping: 'LinearToneMapping',

    }),

    constructThreeObject: function() {
        return new THREE.WebGLRenderer();
    },

    createPropertiesArrays: function() {
        ThreeModel.prototype.createPropertiesArrays.call(this);
    },

});


var WebGLRendererView = ThreeView.extend({
});


module.exports = {
    WebGLRendererView: WebGLRendererView,
    WebGLRendererModel: WebGLRendererModel,
};
