var Promise = require('bluebird');
var LineGeometry = require('../examples/lines/LineGeometry.js').LineGeometry;
var LineGeometryAutogen = require('./LineGeometry.autogen');

var utils = require('../_base/utils');


var LineGeometryModel = LineGeometryAutogen.LineGeometryModel.extend({


    constructThreeObject: function() {

        var result = new LineGeometry();
        return Promise.resolve(result);

    },

});

utils.customModelsLut[LineGeometry.prototype.constructor.name] = 'LineGeometry';

module.exports = {
    LineGeometryModel: LineGeometryModel,
};
