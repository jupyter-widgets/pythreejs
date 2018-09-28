/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

var THREE = require('three');
var LineSegmentsGeometry = require('./LineSegmentsGeometry').LineSegmentsGeometry;
var LineMaterial = require('./LineMaterial').LineMaterial;


var LineSegments2 = function ( geometry, material ) {

	THREE.Mesh.call( this );

	this.type = 'LineSegments2';

	this.geometry = geometry !== undefined ? geometry : new LineSegmentsGeometry();
	this.material = material !== undefined ? material : new LineMaterial( { color: Math.random() * 0xffffff } );

};

LineSegments2.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), {

	constructor: LineSegments2,

	isLineSegments2: true,

	onBeforeRender: function( renderer, scene, camera, geometry, material, group ) {

		if ( material.isLineMaterial ) {

			var size = renderer.getSize();

			material.resolution = new THREE.Vector2(size.width, size.height);

		}

	},

	copy: function ( source ) {

		// todo

		return this;

	},

} );

module.exports = {
	LineSegments2: LineSegments2
};
