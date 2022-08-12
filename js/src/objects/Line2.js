var Promise = require('bluebird');
var Line2 = require('../examples/lines/Line2.js').Line2;
var Line2Autogen = require('./Line2.autogen').Line2Model;

class Line2Model extends Line2Autogen {

    constructThreeObject() {

        var result = new Line2(
            this.convertThreeTypeModelToThree(this.get('geometry'), 'geometry'),
            this.convertThreeTypeArrayModelToThree(this.get('material'), 'material')
        );
        return Promise.resolve(result);

    }

}

module.exports = {
    Line2Model: Line2Model,
};
