//
// This file auto-generated with generate-wrappers.js
// Date: Thu Oct 20 2016 12:05:52 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;


var Object3DModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'Object3DView',
        _model_name: 'Object3DModel',

        uuid: "",
        name: "",
        type: "",
        parent: null,
        children: [],
        up: [0,1,0],
        position: [0,0,0],
        rotation: [0,0,0],
        quaternion: [0,0,0,1],
        scale: [1,1,1],
        modelViewMatrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        normalMatrix: [1,0,0,0,1,0,0,0,1],
        matrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        matrixWorld: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        matrixAutoUpdate: true,
        matrixWorldNeedsUpdate: false,
        visible: true,
        castShadow: false,
        receiveShadow: false,
        frustumCulled: true,
        renderOrder: 0,

    }),

    constructThreeObject: function() {

        return new THREE.Object3D();

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.scalar_properties.push('uuid');
        this.scalar_properties.push('name');
        this.scalar_properties.push('type');
        this.three_properties.push('parent');
        this.three_array_properties.push('children');
        this.vector_properties.push('up');
        this.vector_properties.push('position');
        this.vector_properties.push('rotation');
        this.vector_properties.push('quaternion');
        this.vector_properties.push('scale');
        this.vector_properties.push('modelViewMatrix');
        this.vector_properties.push('normalMatrix');
        this.vector_properties.push('matrix');
        this.vector_properties.push('matrixWorld');
        this.scalar_properties.push('matrixAutoUpdate');
        this.scalar_properties.push('matrixWorldNeedsUpdate');
        this.scalar_properties.push('visible');
        this.scalar_properties.push('castShadow');
        this.scalar_properties.push('receiveShadow');
        this.scalar_properties.push('frustumCulled');
        this.scalar_properties.push('renderOrder');
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

    },

}, {

    serializers: _.extend({
        parent: { deserialize: widgets.unpack_models },
        children: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var Object3DView = ThreeView.extend({});

// Override auto-gen class with custom implementation
var Override = require('./Object3D.js');
_.extend(Object3DModel.prototype, Override.Object3DModel.prototype);
_.extend(Object3DModel, Override.Object3DModel);
_.extend(Object3DView.prototype, Override.Object3DView.prototype);
_.extend(Object3DView, Override.Object3DView);

module.exports = {
    Object3DView: Object3DView,
    Object3DModel: Object3DModel,
};
