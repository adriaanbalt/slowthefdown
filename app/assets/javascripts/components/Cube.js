var THREE = require('three');

// create a standard 1m cube geometry to be used by all
// instances of Cube spawned
// extend the standard THREE.Mesh
// constructor
export default class Cube extends THREE.Mesh {

	constructor(geo, mat ) {
		// super
		super( geo, mat );
		// THREE.Mesh.call( this, geo, mat );

		this.position.x = 0;//(Math.random() - .5 ) * window.innerWidth;
		this.position.y = 0;//(Math.random() - .5 ) * window.innerHeight;
		this.position.z = 0;//(Math.random() - .5 ) * wi;

		this.rot = Math.random();
	}

	// define a custom update function to be called on the cube each frame
	update ( time ) {
		this.rotation.x += this.rot * Math.PI / 180;
		this.rotation.y += this.rot * Math.PI / 180;

		// this.position.z += .2;
		// if ( this.position.z > 100 ) this.position.z = -100;
	}
}