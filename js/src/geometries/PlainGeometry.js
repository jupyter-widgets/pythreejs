//
// This file auto-generated with generate-wrappers.js
// Date: Thu Jun 01 2017 10:45:06 GMT+0200 (W. Europe Daylight Time)
//

var AutogenPlainGeometryModel = require('../geometries/PlainGeometry').PlainGeometryModel;


var PlainGeometryModel = AutogenPlainGeometryModel.extend({

    constructThreeObject: function() {

        var result = new THREE.Geometry();
        return Promise.resolve(result);

    },

});

module.exports = {
    PlainGeometryModel: PlainGeometryModel,
};
