/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

var THREE = require('three');
var LineGeometry = require('./LineGeometry').LineGeometry;
var LineMaterial = require('./LineMaterial').LineMaterial;


var Line2 = function ( geometry, material ) {

	THREE.Mesh.call( this );

	this.type = 'Line2';

	this.geometry = geometry !== undefined ? geometry : new LineGeometry();
	this.material = material !== undefined ? material : new LineMaterial( { color: Math.random() * 0xffffff } );

};

Line2.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), {

	constructor: Line2,

	isLine2: true,

	onBeforeRender: function( renderer, scene, camera, geometry, material, group ) {

		if ( material.isLineMaterial ) {

			var size = renderer.getSize();

			material.resolution = new THREE.Vector2(size.width, size.height);

		}

	},

	copy: function ( source ) {

		// todo

		return this;

	}

} );

module.exports = {
	Line2: Line2
};
