//
// This file auto-generated with generate-wrappers.js
// Date: Fri Oct 21 2016 15:47:51 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');

var ThreeModel = require('../_base/Three').ThreeModel;
var ThreeView = require('../_base/Three').ThreeView;

var PlaneModel = require('./Plane').PlaneModel;
var PlaneView = require('./Plane').PlaneView;

var FrustumModel = ThreeModel.extend({

    defaults: _.extend({}, ThreeModel.prototype.defaults, {

        _view_name: 'FrustumView',
        _model_name: 'FrustumModel',

        p0: null,
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        p5: null,

    }),

    constructThreeObject: function() {

        return new THREE.Frustum(
            this.convertThreeTypeModelToThree(this.get('p0'), 'p0'),
            this.convertThreeTypeModelToThree(this.get('p1'), 'p1'),
            this.convertThreeTypeModelToThree(this.get('p2'), 'p2'),
            this.convertThreeTypeModelToThree(this.get('p3'), 'p3'),
            this.convertThreeTypeModelToThree(this.get('p4'), 'p4'),
            this.convertThreeTypeModelToThree(this.get('p5'), 'p5')
        );

    },

    createPropertiesArrays: function() {

        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.three_properties.push('p0');
        this.three_properties.push('p1');
        this.three_properties.push('p2');
        this.three_properties.push('p3');
        this.three_properties.push('p4');
        this.three_properties.push('p5');
        

        this.property_converters['p0'] = 'convertThreeType';
        this.property_converters['p1'] = 'convertThreeType';
        this.property_converters['p2'] = 'convertThreeType';
        this.property_converters['p3'] = 'convertThreeType';
        this.property_converters['p4'] = 'convertThreeType';
        this.property_converters['p5'] = 'convertThreeType';

    },

}, {

    serializers: _.extend({
        p0: { deserialize: widgets.unpack_models },
        p1: { deserialize: widgets.unpack_models },
        p2: { deserialize: widgets.unpack_models },
        p3: { deserialize: widgets.unpack_models },
        p4: { deserialize: widgets.unpack_models },
        p5: { deserialize: widgets.unpack_models },
    }, ThreeModel.serializers),
    
});

var FrustumView = ThreeView.extend({});

module.exports = {
    FrustumView: FrustumView,
    FrustumModel: FrustumModel,
};
