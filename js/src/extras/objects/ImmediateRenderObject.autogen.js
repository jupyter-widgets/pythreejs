//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:08 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var ImmediateRenderObjectModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'ImmediateRenderObjectView',
        _model_name: 'ImmediateRenderObjectModel',


    }),

    constructThreeObject: function() {

        return new THREE.ImmediateRenderObject();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var ImmediateRenderObjectView = ThreeView.extend({});

module.exports = {
    ImmediateRenderObjectView: ImmediateRenderObjectView,
    ImmediateRenderObjectModel: ImmediateRenderObjectModel,
};
