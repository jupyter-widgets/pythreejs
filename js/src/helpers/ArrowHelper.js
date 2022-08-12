var ArrowHelperAutogen = require('./ArrowHelper.autogen').ArrowHelperModel;

var THREE = require('three');

class ArrowHelperModel extends ArrowHelperAutogen {

    constructThreeObject() {

        var headLength = this.get('headLength');
        var headWidth = this.get('headWidth');

        if (headLength === null) {
            headLength = undefined;
        }
        if (headWidth === null) {
            headWidth = undefined;
        }

        var result = new THREE.ArrowHelper(
            this.convertVectorModelToThree(this.get('dir'), 'dir'),
            this.convertVectorModelToThree(this.get('origin'), 'origin'),
            this.convertFloatModelToThree(this.get('length'), 'length'),
            this.convertColorModelToThree(this.get('color'), 'color'),
            this.convertFloatModelToThree(headLength, 'headLength'),
            this.convertFloatModelToThree(headWidth, 'headWidth')
        );
        return Promise.resolve(result);

    }


    createPropertiesArrays() {
        ArrowHelperAutogen.prototype.createPropertiesArrays.call(this);

        // Prevent from syncing these to object
        delete this.property_converters['origin'];

        // Map with setDirection
        delete this.property_converters['dir'];

        // Map with setColor
        delete this.property_converters['color'];

        // Map these to setLength instead
        delete this.property_converters['length'];
        delete this.property_converters['headLength'];
        delete this.property_converters['headWidth'];

        this.property_mappers['mapArrowHelper'] = 'mapArrowHelper';
    }

    mapArrowHelperModelToThree() {
        var headLength = this.get('headLength');
        var headWidth = this.get('headWidth');

        if (headLength === null) {
            headLength = undefined;
        }
        if (headWidth === null) {
            headWidth = undefined;
        }

        this.obj.setDirection(this.convertVectorModelToThree(this.get('dir'), 'dir'));
        this.obj.setColor(this.convertColorModelToThree(this.get('color'), 'color'));
        this.obj.position.copy(this.convertVectorModelToThree(this.get('origin'), 'origin'));

        this.obj.setLength(
            this.convertFloatModelToThree(this.get('length'), 'length'),
            this.convertFloatModelToThree(headLength, 'headLength'),
            this.convertFloatModelToThree(headWidth, 'headWidth')
        );
    }

    mapArrowHelperThreeToModel() {
        this.set({
            headLength: this.convertFloatThreeToModel(this.obj.cone.scale.y, 'headLength'),
            headWidth: this.convertFloatThreeToModel(this.obj.cone.scale.x, 'headWidth'),
            origin: this.convertVectorThreeToModel(this.obj.position, 'origin'),
        });
    }

}

module.exports = {
    ArrowHelperModel: ArrowHelperModel,
};
