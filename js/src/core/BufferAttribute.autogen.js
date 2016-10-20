//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 15:52:38 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var BufferAttributeModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'BufferAttributeView',
        _model_name: 'BufferAttributeModel',

        uuid: "",
        array: [],
        itemSize: 1,
        count: 0,
        needsUpdate: false,
        normalized: true,
        version: -1,

    }),

    constructThreeObject: function() {

        return new THREE.BufferAttribute(
            this.get('array'),
            this.get('itemSize'),
            this.get('normalized')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('uuid');
        this.array_properties.push('array');
        this.scalar_properties.push('itemSize');
        this.scalar_properties.push('count');
        this.scalar_properties.push('needsUpdate');
        this.scalar_properties.push('normalized');
        this.scalar_properties.push('version');
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['count'] = true;
        this.props_created_by_three['version'] = true;

    },

});

var BufferAttributeView = ThreeView.extend({});

module.exports = {
    BufferAttributeView: BufferAttributeView,
    BufferAttributeModel: BufferAttributeModel,
};
