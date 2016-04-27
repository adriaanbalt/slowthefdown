import THREE from 'three';
import ThreeScene from './ThreeScene';
import PlanetSystem from './System';

export default class Sketch {

	constructor(){
		console.log ( "Sketch constructor" );
		// create a new ThreeJS Scene
		this.scene = new ThreeScene();

		// create star skydome
		let skyGeo = new THREE.SphereGeometry( 2500, 25, 25 );
		let texture = new THREE.TextureLoader();
		// load a resource
		texture.load(
			// resource URL
			'/assets/images/textures/stars.jpg',
			// Function when resource is loaded
			( texture ) => {
				console.log ( 'texture', texture );
				// do something with the texture
				this.material = new THREE.MeshPhongMaterial({
					map: texture
				});

				let sky = new THREE.Mesh( skyGeo, this.material );
				sky.material.side = THREE.BackSide;
				this.scene.add( sky );

			},
			// Function called when download progresses
			( xhr ) => {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			( xhr ) => {
				console.log( 'An error happened', xhr );
			}
		);

		// create a dim ambient light
		let ambientLight = new THREE.AmbientLight( 0xdddddd );
		this.scene.add( ambientLight );

		let light = new THREE.PointLight( 0x7651c0, 10, 500 );
		light.position.set( 300, 200, 50 );
		this.scene.add( light );

		this.system = new PlanetSystem();
		this.system.position.x = 0.0;
		this.scene.add( this.system );

		// let pos = _.clone( this.system.position );
		// this.scene.changeTarget( pos, false );

		// this.showSystem( 0, false );
	}

	// -----------------------------------------------------------------------------
	// Move the scene camera to the selected planet
	// -----------------------------------------------------------------------------

	// showSystem( systemId, animate ) {

	// 	let system = systems[systemId];
	// 	if( system ){
	// 		let pos = _.clone( system.position );
	// 		this.scene.changeTarget( pos, animate );
	// 	}
	// }
}


