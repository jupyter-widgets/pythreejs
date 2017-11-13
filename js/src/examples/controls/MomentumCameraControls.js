/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

var THREE = require('three');

var FlyControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	// Set to false to disable this control
	this.enabled = true;

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.05;

	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	// internals

	this.tmpQuaternion = new THREE.Quaternion();
	var lastPosition = new THREE.Vector3();
	var lastQuaternion = new THREE.Quaternion();
	var scope = this;
	var EPS = 0.000001;

	this.mouseStatus = 0;

	this.handleEvent = function ( event ) {
		if ( typeof this[ event.type ] == 'function' ) {
			this[ event.type ]( event );
		}
	};

	this.update = function( delta ) {

		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		this.object.position.addScaledVector(this.moveVector, moveMult);

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiply( this.tmpQuaternion );

		// expose the rotation vector for convenience
		this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
		if (lastPosition.distanceToSquared( this.object.position ) > EPS ||
			8 * ( 1 - lastQuaternion.dot( this.object.quaternion ) ) > EPS ) {

			this.dispatchEvent( changeEvent );
			lastPosition.copy( this.object.position );
			lastQuaternion.copy( this.object.quaternion );
			return true;
		}
		return false;
	};

	this.dispose = function() {};
	this.connectEvents = function(element) {
		if (element) {
			scope.domElement = element;
		}
	};

	// events

	var changeEvent = { type: 'change' };

	// Initialize lastPosition/Quaternion to initial values.
	this.update(0);
};

FlyControls.prototype = Object.create( THREE.EventDispatcher.prototype );
FlyControls.prototype.constructor = FlyControls;

module.exports = {
	FlyControls: FlyControls
};
