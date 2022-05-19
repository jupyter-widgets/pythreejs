var Promise = require('bluebird');
var LineSegments2 = require('../examples/lines/LineSegments2.js').LineSegments2;
var LineSegments2Autogen = require('./LineSegments2.autogen').LineSegments2Model;

class LineSegments2Model extends LineSegments2Autogen {

    constructThreeObject() {

        var result = new LineSegments2(
            this.convertThreeTypeModelToThree(this.get('geometry'), 'geometry'),
            this.convertThreeTypeArrayModelToThree(this.get('material'), 'material')
        );
        return Promise.resolve(result);

    }

}

module.exports = {
    LineSegments2Model: LineSegments2Model,
};
