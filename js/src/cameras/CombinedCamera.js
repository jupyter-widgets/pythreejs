var Promise = require('bluebird');
var CombinedCamera = require('../examples/cameras/CombinedCamera.js').CombinedCamera;
var CombinedCameraAutogen = require('./CombinedCamera.autogen').CombinedCameraModel;

class CombinedCameraModel extends CombinedCameraAutogen {

    createPropertiesArrays() {
        CombinedCameraAutogen.prototype.createPropertiesArrays.call(this);

        this.property_mappers['CombinedCamera'] = 'mapCombinedCamera';
        delete this.property_converters['width'];
        delete this.property_converters['height'];
        delete this.property_converters['near'];
        delete this.property_converters['far'];
        delete this.property_converters['orthoNear'];
        delete this.property_converters['orthoFar'];
        delete this.property_converters['mode'];
    }

    constructThreeObject() {

        var result = new CombinedCamera(
            this.convertFloatModelToThree(this.get('width'), 'width'),
            this.convertFloatModelToThree(this.get('height'), 'height'),
            this.convertFloatModelToThree(this.get('fov'), 'fov'),
            this.convertFloatModelToThree(this.get('near'), 'near'),
            this.convertFloatModelToThree(this.get('far'), 'far'),
            this.convertFloatModelToThree(this.get('orthoNear'), 'orthoNear'),
            this.convertFloatModelToThree(this.get('orthoFar'), 'orthoFar')
        );
        result.impersonate = this.convertBoolModelToThree(
            this.get('impersonate'), 'impersonate');
        return Promise.resolve(result);

    }

    mapCombinedCameraModelToThree() {

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

        // This update projection matrix, and sets correct mode
        this.obj.toPerspective();
        if (this.get('mode') === 'orthographic') {
            this.obj.toOrthographic();
        }
    }

    mapCombinedCameraThreeToModel() {

        var toSet = {};
        toSet.width = this.convertFloatThreeToModel(this.obj.right - this.obj.left);
        toSet.height = this.convertFloatThreeToModel(this.obj.top - this.obj.bottom);

        toSet.near = this.convertFloatThreeToModel(this.obj.cameraP.near);
        toSet.far = this.convertFloatThreeToModel(this.obj.cameraP.far);
        toSet.orthoNear = this.convertFloatThreeToModel(this.obj.cameraO.near);
        toSet.orthoFar = this.convertFloatThreeToModel(this.obj.cameraO.far);

        toSet.mode = this.obj.inPerspectiveMode ? 'perspective' : 'orthographic';

        this.set(toSet, 'pushFromThree');

    }
}

module.exports = {
    CombinedCameraModel: CombinedCameraModel,
};
