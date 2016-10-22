//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;


var AmbientLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'AmbientLightView',
        _model_name: 'AmbientLightModel',


    }),

    constructThreeObject: function() {

        return new THREE.AmbientLight(
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;


    },

});

var AmbientLightView = LightView.extend({});

module.exports = {
    AmbientLightView: AmbientLightView,
    AmbientLightModel: AmbientLightModel,
};
