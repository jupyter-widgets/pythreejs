//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:59:18 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../../_base/Three').ThreeModel;
var ThreeView = require('../../_base/Three').ThreeView;


var CatmullRomCurve3Model = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'CatmullRomCurve3View',
        _model_name: 'CatmullRomCurve3Model',


    }),

    constructThreeObject: function() {

        return new THREE.CatmullRomCurve3();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        


    },

});

var CatmullRomCurve3View = ThreeView.extend({});

module.exports = {
    CatmullRomCurve3View: CatmullRomCurve3View,
    CatmullRomCurve3Model: CatmullRomCurve3Model,
};
