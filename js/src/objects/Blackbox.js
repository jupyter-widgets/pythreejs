var Promise = require('bluebird');
var THREE = require('three');
var BlackboxAutogen = require('./Blackbox.autogen').BlackboxModel;

/**
 * This object is intended as an extension point. It differs from
 * a normal Object3D in that it does not sync back child objects to
 * the models. This allows extensions to build sub-scene graphs that
 * might not be possible/feasible/desirable to sync.
 *
 * To implement an extended object based on this:
 *  - Extend this model
 *  - Override defaults/serializers as normal for a widget. Remember
 *    to call the super methods!
 *  - Override initialize method. Call super, and then put any
 *    extension code that relies on the THREE object inside
 *    a "then" to `initPromise:
 *
 *      this.initPromise.then(() => {
 *        // Do your stuff here
 *      });
 *  - If you do not want a basic Object3D as the "root" of your black
 *    box, you need to override constructThreeObject[Async].
 */
class BlackboxModel extends BlackboxAutogen {

    defaults() {
        var superdef = BlackboxAutogen.prototype.defaults.call(this);
        delete superdef['children'];
        return superdef;
    }


    constructThreeObject() {

        var result = new THREE.Object3D();
        return Promise.resolve(result);

    }

    createPropertiesArrays() {

        BlackboxAutogen.prototype.createPropertiesArrays.call(this);
        delete this.three_nested_properties['children'];
        delete this.property_converters['children'];

    }

}

module.exports = {
    BlackboxModel: BlackboxModel,
};
