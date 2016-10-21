//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var EventDispatcherModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'EventDispatcherView',
        _model_name: 'EventDispatcherModel',


    }),

    constructThreeObject: function() {

        return new THREE.EventDispatcher();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var EventDispatcherView = ThreeView.extend({});

module.exports = {
    EventDispatcherView: EventDispatcherView,
    EventDispatcherModel: EventDispatcherModel,
};
