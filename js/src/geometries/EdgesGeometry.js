var EdgesGeometryAutogen = require('./EdgesGeometry.autogen').EdgesGeometryModel;

class EdgesGeometryModel extends EdgesGeometryAutogen {

    createPropertiesArrays() {
        EdgesGeometryAutogen.prototype.createPropertiesArrays.call(this);

        // three.js DataTexture stores the data, width, and height props together in a dict called 'image'
        this.property_mappers['EdgesGeometryProps'] = 'mapEdgesGeometryProps';
        delete this.property_converters['geometry'];
        delete this.property_converters['thresholdAngle'];
    }

    mapEdgesGeometryPropsModelToThree() {
        var params = this.obj.parameters;
        params['geometry'] = this.convertThreeTypeModelToThree(this.get('geometry'));
        params['thresholdAngle'] = this.convertFloatModelToThree(this.get('thresholdAngle'));
    }

    mapEdgesGeometryPropsThreeToModel() {
        var params = this.obj.parameters;
        var toSet = {
            thresholdAngle: this.convertFloatThreeToModel(params.thresholdAngle),
        };
        if (params.geometry) {
            toSet.geometry = this.convertThreeTypeThreeToModel(params.geometry);
        } else {
            toSet.geometry = this.get('geometry');
        }
        this.set(toSet, 'pushFromThree');
    }

}

module.exports = {
    EdgesGeometryModel: EdgesGeometryModel,
};
