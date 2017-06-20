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
