//
// This file auto-generated with generate-wrappers.js
// Date: Wed May 10 2017 14:05:45 GMT+0200 (W. Europe Daylight Time)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;

var SceneModel = require('../scenes/Scene').SceneModel;
var SceneView = require('../scenes/Scene').SceneView;
var CameraModel = require('../cameras/Camera').CameraModel;
var CameraView = require('../cameras/Camera').CameraView;
var ControlsModel = require('../Controls').ControlsModel;
var ControlsView = require('../Controls').ControlsView;
var EffectModel = require('../Effect').EffectModel;
var EffectView = require('../Effect').EffectView;

var RendererModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'RendererView',
        _model_name: 'RendererModel',

        width: "600",
        height: "400",
        scene: null,
        camera: null,
        controls: [],
        effect: null,
        background: "black",
        background_opacity: 0,

    }),

    constructThreeObject: function() {

        var result = new THREE.Renderer();
        return Promise.resolve(result);

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('scene');
        this.three_properties.push('camera');
        this.three_array_properties.push('controls');
        this.three_properties.push('effect');
        

        this.property_converters['width'] = null;
        this.property_converters['height'] = null;
        this.property_converters['scene'] = 'convertThreeType';
        this.property_converters['camera'] = 'convertThreeType';
        this.property_converters['controls'] = 'convertThreeTypeArray';
        this.property_converters['effect'] = 'convertThreeType';
        this.property_converters['background'] = 'convertColor';
        this.property_converters['background_opacity'] = null;

    },

}, {

    serializers: _.extend({
        scene: { deserialize: widgets.unpack_models },
        camera: { deserialize: widgets.unpack_models },
        controls: { deserialize: widgets.unpack_models },
        effect: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var RendererView = ThreeView.extend({});

module.exports = {
    RendererView: RendererView,
    RendererModel: RendererModel,
};
