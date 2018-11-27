var Promise = require('bluebird');
var dataserializers = require('jupyter-dataserializers');
var ndarray = require('ndarray');
var LineSegmentsGeometry = require('../examples/lines/LineSegmentsGeometry.js').LineSegmentsGeometry;
var LineSegmentsGeometryAutogen = require('./LineSegmentsGeometry.autogen').LineSegmentsGeometryModel;

var utils = require('../_base/utils');


var LineSegmentsGeometryModel = LineSegmentsGeometryAutogen.extend({

    constructThreeObject: function() {

        var result = new LineSegmentsGeometry();
        return Promise.resolve(result);

    },

    createPropertiesArrays: function() {

        LineSegmentsGeometryAutogen.prototype.createPropertiesArrays.call(this);

        this.property_assigners['positions'] = 'assignLineAttribute';
        this.property_assigners['colors'] = 'assignLineAttribute';

    },

    assignLineAttribute: function(obj, key, value) {
        if (key === 'positions') {
            obj.setPositions(value || []);
        } else if (key === 'colors') {
            if (value) {
                obj.setColors(value);
            }
        } else {
            throw new Error(`Unknown line attribute key: ${key}`);
        }
    },

    convertArrayBufferThreeToModel: function(arrBuffer, propName) {
        // This property is write-only, so always return current value.
        return this.get(propName);
    },

});

utils.customModelsLut[LineSegmentsGeometry.prototype.constructor.name] = 'LineSegmentsGeometry';

module.exports = {
    LineSegmentsGeometryModel: LineSegmentsGeometryModel,
};
