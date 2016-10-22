//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var LightModel = require('./Light').LightModel;
var LightView = require('./Light').LightView;


var HemisphereLightModel = LightModel.extend({

    defaults: _.extend({}, LightModel.prototype.defaults, {

        _view_name: 'HemisphereLightView',
        _model_name: 'HemisphereLightModel',

        groundColor: "#000000",

    }),

    constructThreeObject: function() {

        return new THREE.HemisphereLight(
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.convertColorModelToThree(this.get('groundColor'), 'groundColor'),
            this.get('intensity')
        );

    },

    createPropertiesArrays: function() {

        LightModel.prototype.createPropertiesArrays.call(this);
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['groundColor'] = 'convertColor';

    },

});

var HemisphereLightView = LightView.extend({});

module.exports = {
    HemisphereLightView: HemisphereLightView,
    HemisphereLightModel: HemisphereLightModel,
};
