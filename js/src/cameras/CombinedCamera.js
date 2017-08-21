var _ = require('underscore');
var CombinedCameraAutogen = require('./CombinedCamera.autogen');

var CombinedCameraModel = CombinedCameraAutogen.CombinedCameraModel.extend({

    createPropertiesArrays: function() {
        CombinedCameraAutogen.prototype.createPropertiesArrays.call(this);

        this.property_mappers['CombinedCamera'] = 'mapCombinedCamera';
        delete this.property_converters['width'];
        delete this.property_converters['height'];
        delete this.property_converters['near'];
        delete this.property_converters['far'];
        delete this.property_converters['orthoNear'];
        delete this.property_converters['orthoFar'];
    },

    mapCombinedCameraModelToThree: function() {

        var width = this.convertFloatModelToThree(this.get('width'));
        var height = this.convertFloatModelToThree(this.get('height'));
        this.obj.left = - width / 2;
        this.obj.right = width / 2;
        this.obj.top = height / 2;
        this.obj.bottom = - height / 2;

        this.obj.aspect =  width / height;
        this.obj.cameraP.near = this.convertFloatModelToThree(this.get('near'));
        this.obj.cameraP.far = this.convertFloatModelToThree(this.get('far'));
        this.obj.cameraO.near = this.convertFloatModelToThree(this.get('orthoNear'));
        this.obj.cameraO.far = this.convertFloatModelToThree(this.get('orthoFar'));

        // Always update the projection matrix after setting the attributes:
        this.obj.updateProjectionMatrix();
    },

    mapCombinedCameraThreeToModel: function() {

        var toSet = {};
        toSet.width = this.convertFloatThreeToModel(this.obj.right - this.obj.left);
        toSet.height = this.convertFloatThreeToModel(this.obj.top - this.obj.bottom);

        toSet.near = this.convertFloatThreeToModel(this.obj.cameraP.near);
        toSet.near = this.convertFloatThreeToModel(this.obj.cameraP.far);
        toSet.orthoNear = this.convertFloatThreeToModel(this.obj.cameraO.near);
        toSet.orthoFar = this.convertFloatThreeToModel(this.obj.cameraO.far);

        this.set(toSet, 'pushFromThree');

    },
});

module.exports = {
    CombinedCameraModel: CombinedCameraModel,
};
