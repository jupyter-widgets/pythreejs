//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;


var PointLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'PointLightView',
        _model_name: 'PointLightModel',

        power: 12.566370614359172,
        distance: 0,
        decay: 1,

    }),

    constructThreeObject: function() {

        return new THREE.PointLight(
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.get('intensity'),
            this.get('distance'),
            this.get('decay')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['power'] = null;
        this.property_converters['distance'] = null;
        this.property_converters['decay'] = null;

    },

});

var PointLightView = LightView.extend({});

module.exports = {
    PointLightView: PointLightView,
    PointLightModel: PointLightModel,
};
