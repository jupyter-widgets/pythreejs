//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 17:17:07 GMT-0700 (PDT)
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
        this.three_properties.push('parent');
        this.three_array_properties.push('children');
        
        this.props_created_by_three['uuid'] = true;
        this.props_created_by_three['type'] = true;

        this.property_converters['uuid'] = null;
        this.property_converters['name'] = null;
        this.property_converters['type'] = null;
        this.property_converters['parent'] = 'convertThreeType';
        this.property_converters['children'] = 'convertThreeTypeArray';
        this.property_converters['up'] = 'convertVector';
        this.property_converters['position'] = 'convertVector';
        this.property_converters['rotation'] = 'convertVector';
        this.property_converters['quaternion'] = 'convertVector';
        this.property_converters['scale'] = 'convertVector';
        this.property_converters['modelViewMatrix'] = 'convertMatrix';
        this.property_converters['normalMatrix'] = 'convertMatrix';
        this.property_converters['matrix'] = 'convertMatrix';
        this.property_converters['matrixWorld'] = 'convertMatrix';
        this.property_converters['matrixAutoUpdate'] = null;
        this.property_converters['matrixWorldNeedsUpdate'] = null;
        this.property_converters['visible'] = null;
        this.property_converters['castShadow'] = null;
        this.property_converters['receiveShadow'] = null;
        this.property_converters['frustumCulled'] = null;
        this.property_converters['renderOrder'] = null;

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
