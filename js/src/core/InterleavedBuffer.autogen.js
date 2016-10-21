//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var InterleavedBufferModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'InterleavedBufferView',
        _model_name: 'InterleavedBufferModel',


    }),

    constructThreeObject: function() {

        return new THREE.InterleavedBuffer();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var InterleavedBufferView = ThreeView.extend({});

module.exports = {
    InterleavedBufferView: InterleavedBufferView,
    InterleavedBufferModel: InterleavedBufferModel,
};
