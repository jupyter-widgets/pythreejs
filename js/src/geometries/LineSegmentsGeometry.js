var Promise = require('bluebird');
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
            obj.setPositions(value);
        } else if (key === 'colors') {
            obj.setColors(value);
        } else {
            throw new Error(`Unknown line attribute key: ${key}`);
        }
    },

    convertArrayBufferThreeToModel: function(arrBuffer, propName) {
        if (arrBuffer === null) {
            return null;
        }
        var current = this.get(propName);
        var currentArray = dataserializers.getArray(current);
        if (currentArray && (currentArray.data === arrBuffer)) {
            // Unchanged, do nothing
            return current;
        }
        // Never create a new widget, even if current is one
        return ndarray(arrBuffer, currentArray && currentArray.shape);
    },

});

utils.customModelsLut[LineSegmentsGeometry.prototype.constructor.name] = 'LineSegmentsGeometry';

module.exports = {
    LineSegmentsGeometryModel: LineSegmentsGeometryModel,
};
