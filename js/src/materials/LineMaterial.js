var Promise = require('bluebird');
var LineMaterial = require('../examples/lines/LineMaterial.js').LineMaterial;
var LineMaterialAutogen = require('./LineMaterial.autogen').LineMaterialModel;

var utils = require('../_base/utils');


class LineMaterialModel extends LineMaterialAutogen {

    constructThreeObject() {

        var result = new LineMaterial({
            color: this.convertColorModelToThree(this.get('color'), 'color'),
            dashScale: this.convertFloatModelToThree(this.get('dashScale'), 'dashScale'),
            dashSize: this.convertFloatModelToThree(this.get('dashSize'), 'dashSize'),
            gapSize: this.convertFloatModelToThree(this.get('gapSize'), 'gapSize'),
            linewidth: this.convertFloatModelToThree(this.get('linewidth'), 'linewidth'),
            type: this.get('type'),
        });
        return Promise.resolve(result);

    }

}

utils.customModelsLut[LineMaterial.prototype.constructor.name] = 'LineMaterial';

module.exports = {
    LineMaterialModel: LineMaterialModel,
};
