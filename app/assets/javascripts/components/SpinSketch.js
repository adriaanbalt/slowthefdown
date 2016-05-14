// REQUIREMENTS
import THREE from 'three';

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
	}

	update( time ) {
		// console.log ( 'spin shader update', this.pulse );
		// if ( 0 < this.pulse && this.pulse < 15 ) {
		// 	console.log ( "inside space!" );
		// 	this.pulse += -0.1;
		// } else {
		// 	this.pulse -= 0.1;
		// }
		// this.pulse = THREE.Math.clamp( this.pulse, 0.0, 25.0 );
		// this.shaderMat.uniforms['iPulse'].value = this.pulse;
		this.shaderMat.uniforms['iTime'].value = time;
		this.position.z = 0;
	}
}


export default class SpinText extends THREE.Object3D {

  constructor( cb ) {
	super();

	this.superName = "F";

	this.mat = new THREE.MeshPhongMaterial({
	  color: 0xFFFFFF,
	  // map: THREE.ImageUtils.loadTexture('assets/textures/uv.jpg'),
	  shininess: 1
	});

	let fontLoader = new THREE.FontLoader();
	fontLoader.load( '/assets/fonts/helvetiker_bold.typeface.js', ( response ) => {
		this.font = response;
		this.geo = new THREE.TextGeometry( "x",{
			font: this.font,
			size: 100,
			height: 10,
			curveSegments: 4,
			bevelThickness: 1,
			bevelSize: 0,
			bevelEnabled: true,
			material: 0,
			extrudeMaterial: 0
		});
		this.fTxt = new THREE.Mesh( this.geo, this.mat );
		this.add( this.fTxt );
		cb();
	});

	let geometry = new THREE.CircleGeometry( 60, 10 );
	let material = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.0 } );
	material.transparent = true;
	this.circle = new THREE.Mesh( geometry, material );
	this.circle.position.x = 25;
	this.circle.position.y = 50;
	this.add( this.circle );

	this.vx = Math.random() - 0.5;
	this.vy = Math.random() - 0.5;

	this.acceleration = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	// this.vec = new THREE.Vector3( 0, 0, 0 );
	this.speed = 3;
	this.mass = 2;
	this.gravity = 1.0;
	let pos = new THREE.Vector3( 50.0, 50.0, 0 );
	this.position.set( pos.x, pos.y, pos.z );

	this.centerPosition = new THREE.Vector3( 1, 2, 0 );

  }

  setSpeed( newSpeed ) {
  	this.speed = newSpeed;
  }

  setDepth( newZ ) {
  	this.position.z = newZ;
  }

  // define a custom update function to be called on the cube each frame
  update( time ) {

  	console.log ( 'time', time );

	this.dx = (Math.sin( (time * this.speed * 1.15 )) * 200) + (Math.sin( (time * this.speed * .33 )) * 33); // X distance from center - movement with speed
	this.dy = (Math.cos( (time * this.speed * 1.45 )) * 45) + (Math.sin( (time * this.speed * .15 )) * 45) ; // Y distance from center - movement with speed over time

	this.position.x = this.dx;
	this.position.y = this.dy;


	// let force = new THREE.Vector3().subVectors( this.position, this.centerPosition );
	// let d = force.length(); // Distance between objects
	// // d = THREE.Math.clamp( d, 1.0, 10.0 ); // Limiting the distance to eliminate "extreme" results for very close or very far objects
	// force = force.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)

	// this.vx = Math.random() * 0.5;
	// let strength = Math.cos( ( this.vx * this.mass * this.speed ) );   // Calculate gravitional force magnitude
	// force = force.multiplyScalar( strength ); // Get force vector --> magnitude * direction
	// // force = THREE.Math.clamp( force, 1.0, 100.0 );

	// // return a new Vector, which is the force divided by mass
	// let f = new THREE.Vector3( force.x, force.y, force.z );
	// // f.divideScalar( this.mass );
	// this.acceleration.add( f );

	// this.velocity.add( this.acceleration );
	// this.position.add( this.velocity );

	// // // reset acceleration
	// this.acceleration.multiplyScalar( 0 );

	// console.log ( 'this.position', this.velocity, force, strength);


	// this.vx += Math.random() * 0.5 - 0.25;
	// this.vy += Math.random() * 0.5 - 0.25;

	// let newx = this.x + this.vx;
	// let newy = this.y + this.vy;
	// let dy = newy - this.y;
	// let dx = newx - this.x;
							   
	// // let a = (Math.atan2(dy, dx) + PIBY2)*ToDegrees;  // The new target rotation in degrees
	// // dot.transform("r"+a);;

	// this.x += this.vx;
	// this.y += this.vy;

	// this.vx *= this.DAMP;
	// this.vy *= this.DAMP;

	// //check bounds invert direction 
	// this.vx = this.x < 50 ? this.vx * -1 : this.x > 415 ? this.vx * -1 : this.vx;
	// this.vy = this.y < 50 ? this.vy * -1 : this.y > 415 ? this.vy * -1 : this.vy;
	// this.x = this.x < 0 ? window.innerWidth : this.x > window.innerWidth ? 0 : this.x;
	// this.y = this.y < 0 ? window.innerHeight : this.y > window.innerHeight ? 0 : this.y;

	// this.position.x = this.x * (Math.random() * .1);
	// this.position.y = this.y * (Math.random() * .1);

	// this.rotation.x += this.rot;// * Math.PI / 180;
	// this.rotation.y += this.rot;// * Math.PI / 180;

	// // this.position.z = Math.sin( time * this.speed ) * 350 + 350;

	// this.position.x += 1;
	// this.position.y += 1;
	// this.position.z -= .5;
	// if ( this.position.x > window.innerWidth ) this.position.x = -100;
	// if ( this.position.y > window.innerHeight ) this.position.y = -100;
	// if ( this.position.z > 100 ) this.position.z = 1;

	// this.velocity.add( this.acceleration );
	// this.position.add( this.velocity );

	// // reset acceleration
	// this.acceleration.multiplyScalar( 0 );

  }

}



export default class SpinSketch {

	constructor( overFn, outFn ){

		this.overFn = overFn;
		this.outFn	= outFn;

		this.once = true;
		this.overTime = null;
		this.scene = new THREE.Scene();

		this.mouse = new THREE.Vector2();
		// add some unused fog by default
		// this.fog = new THREE.FogExp2( 0x000000, .07 );

		// create the camera
		this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
		this.camera.position.z = 1000;

		this.raycaster = new THREE.Raycaster();

		// create the renderer
		this.renderer = new THREE.WebGLRenderer();

		// enable retina resolution if available
		this.renderer.setPixelRatio( window.devicePixelRatio || 1 );

		// set the renderer to be the full size of our browser window
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		// create a clock for this scene
		this.clock = new THREE.Clock( true );

		// create a dim ambient light
		let ambientLight = new THREE.AmbientLight( 0x555555 );
		this.scene.add( ambientLight );

		// and a brighter point light slightly off center
		let pointLight = new THREE.PointLight( 0xffeedd );
		pointLight.position.set( 0, 0, 800 );
		this.scene.add( pointLight );


		var GPUParticleShader = {

			vertexShader: [
				'varying vec2 vUv;',
				'void main()',
				'{',
					'vUv = uv;',
					'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );',
					'gl_Position = projectionMatrix * mvPosition;',
				'}',
			].join("\n"),

			fragmentShader: [
				'precision highp float;',

				'uniform float iTime;',
				'uniform float iPulse;',
				'uniform sampler2D iText0;',
				'uniform sampler2D iText1;',

				'varying vec2 vUv;',

				'void main()',
				'{',
					'vec2 p = -1.0 + 2.0 * vUv;',
					'vec2 q = p - vec2(0.5, 0.5);',// start pos

					'q.x += 0.4 - sin((iTime * 0.) * 0.9) * 0.2;', // X distance from center - movement with speed
					'q.y += 0.3 - cos((iTime * 0.) * 0.9) * 0.2;', // Y distance from center - movement with speed over time

					'float len = length(q);',

					'float a = atan(q.y, q.x);',  //speed of rotation
					'float b = atan(q.y, q.x);', //speed of rotation
					'float r1 = 0.3;',
					'float r2 = 0.5;',
					// 'float r1 = 0.3 / len + iTime * 0.5;',
					// 'float r2 = 0.5 / len + iTime * 0.5;',

					'float m = (1. + sin(iTime * 0.9)) / 1.0;',

					'vec4 tex1 = texture2D(iText0, vec2(a, r1 ));',
					'vec4 tex2 = texture2D(iText1, vec2(b, r2 ));',

					// 'vec4 tex1 = texture2D(iText0, vec2(a + 0.1 / len, r1 ));',
					// 'vec4 tex2 = texture2D(iText1, vec2(b + 0.1 / len, r2 ));',

					'vec3 col = vec3(mix(tex1, tex2, m));',
					// 'vec3 col = vec3(tex1));',
					'vec3 d = col * len * 0.5 * iPulse;',
					'gl_FragColor = vec4(d, 1.0);',
				'}',
			].join("\n")

		};

		this.particleSpriteTex = THREE.ImageUtils.loadTexture("assets/images/texture.png");

		var tuniform = {
			iTime: { type: 'f', value: 0.1 },
			iText0: { type: 't', value: THREE.ImageUtils.loadTexture( 'assets/images/seamless-texture-polar.png') },
			iText1: { type: 't', value: THREE.ImageUtils.loadTexture( 'assets/images/seamless-texture-polar.png' ) },
			iPulse: { type: 'f', value: 4 }
		};

		tuniform.iText0.value.wrapS = tuniform.iText0.value.wrapT = THREE.RepeatWrapping;
		tuniform.iText1.value.wrapS = tuniform.iText1.value.wrapT = THREE.RepeatWrapping;

		let geo = new THREE.PlaneGeometry( (window.innerWidth), (window.innerHeight) );
		// let geo = new THREE.SphereGeometry( 1000, 16, 32 );
		this.particleShaderMat = new THREE.ShaderMaterial({
			uniforms: tuniform,
			vertexShader: GPUParticleShader.vertexShader,
			fragmentShader: GPUParticleShader.fragmentShader,
			side:THREE.DoubleSide
		});
		this.spinshader = new SpinShader( geo, this.particleShaderMat );
		this.spinshader.position.z = -1000;

		this.spinText = new SpinText(() => this.animate());
		this.scene.add( this.spinshader );
		this.scene.add( this.spinText );

		// font — THREE.Font.
		// size — Float. Size of the text.
		// height — Float. Thickness to extrude text. Default is 50.
		// curveSegments — Integer. Number of points on the curves. Default is 12.
		// bevelEnabled — Boolean. Turn on bevel. Default is False.
		// bevelThickness — Float. How deep into text bevel goes. Default is 10.
		// bevelSize — Float. How far from text outline is bevel. Default is 8.

		document.addEventListener( 'mousemove', (e)=> this.onDocumentMouseMove(e), false );
		document.addEventListener( 'touchstart', (e)=> this.onDocumentMouseMove(e), false)
		document.addEventListener( 'touchmove', (e)=> this.onDocumentMouseMove(e), false)


		// add the camera to the scene
		this.scene.add( this.camera );

		// subscribe to resize events
		window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
		this.onWindowResize();

		// add the Three.js canvas to the document
		document.body.appendChild( this.renderer.domElement );

	}

	onDocumentMouseMove( event ) {
		event.preventDefault();
  		let xPos = event.touches ? event.touches[0].pageX : 0;
  		let yPos = event.touches ? event.touches[0].pageY : 0;
		this.mouse.x = ( xPos / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( yPos / window.innerHeight ) * 2 + 1;
	}

	// browser resize handler
	onWindowResize(){
		// update camera
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		console.log ( 'this.spinShader', this.spinshader );

		// this.spinshader.geometry.width = window.innerWidth;
		// this.spinshader.geometry.height = window.innerHeight;

		// update renderer
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	// animate function - gets calls each frame
	animate() {
		// get the time elapsed since the start of the scene
		let delta = this.clock.getDelta();
		let time = this.clock.getElapsedTime();

		// get the latest audio frequency data
		// this.analyser.getFloatFrequencyData( this.freqData );

		// update any children with an 'update' method defined, and pass them the
		// time elapsed since the start of the scene, if they need it
		this.scene.traverse( child => {
			if( child.update !== undefined ) {
				child.update( time, delta )
			}
		});

		this.raycaster.setFromCamera( this.mouse, this.camera );
		this.intersects = this.raycaster.intersectObjects( this.scene.children, true );
		

		if ( this.intersects.length > 0 ) {
			if ( this.intersects[0].distance > 0 && this.intersects[0].object.parent.superName == "F"){
				if ( this.once ) {
					this.spinText.setSpeed( 2 );
					this.spinText.setDepth( 500 );
					this.overTime = Date.now();
					this.once = false;
				}
				this.overFn();
			}
		} else {
			console.log ( "over here" );
			if ( this.overTime ){

				this.spinText.setSpeed( 3 );
				this.spinText.setDepth( 800 );
				this.outTime = Date.now();
				this.highscore = (this.outTime - this.overTime )/ 1000;
				this.overTime = null;
				// this.once = true;
				this.outFn( this.highscore );
			}
		}


		// render the scene
		this.renderer.render( this.scene, this.camera );

		// subscribe to the next frame event
		requestAnimationFrame( () => this.animate() );
	}


}

