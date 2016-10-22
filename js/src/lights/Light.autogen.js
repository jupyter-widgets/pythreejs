//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var Object3DModel = require('../core/Object3D').Object3DModel;
var Object3DView = require('../core/Object3D').Object3DView;


var LightModel = Object3DModel.extend({

    defaults: _.extend({}, Object3DModel.prototype.defaults, {

        _view_name: 'LightView',
        _model_name: 'LightModel',

        color: "#ffffff",
        intensity: 1,

    }),

    constructThreeObject: function() {

        return new THREE.Light(
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        Object3DModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['color'] = 'convertColor';
        this.property_converters['intensity'] = null;

    },

});

var LightView = Object3DView.extend({});

module.exports = {
    LightView: LightView,
    LightModel: LightModel,
};
