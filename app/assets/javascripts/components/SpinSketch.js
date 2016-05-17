// REQUIREMENTS
import THREE from 'three';
import SimplexNoise from 'simplex-noise';

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
		this.hover = 3;
		this.superName = "SpinShader";
	}

	setSpeed( hover ) {
		this.hover = hover;
	}

	update( time ) {
		this.shaderMat.uniforms['iTime'].value = time;
		this.shaderMat.uniforms['iHover'].value = this.hover;
		this.position.z = 0;
	}
}


export default class SpinText extends THREE.Object3D {

  constructor( cb ) {
	super();

	this.superName = "F";

	this.simplex = new SimplexNoise(Math.random);

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
	this.progress = 0 ;
	this.add( this.circle );

	this.vx = Math.random() - 0.5;
	this.vy = Math.random() - 0.5;

	this.acceleration = new THREE.Vector3();
	this.velocity = 0.01;
	this.radius = 500;
	this.noiseAccum = 0;
	// this.vec = new THREE.Vector3( 0, 0, 0 );
	this.speed = 100;
	this.mass = 2;
	this.gravity = 1.0;

	let pos = new THREE.Vector3( 50.0, 50.0, 0 );
	this.position.set( pos.x, pos.y, pos.z );

	this.centerPosition = new THREE.Vector3( 1, 2, 0 );

  }

  setSpeed( newSpeed ) {
  	this.speed = newSpeed;
  }

  setNoiseSpeed( newSpeed ) {
  	this.noiseSpeed = newSpeed;
  }

  setDepth( newZ ) {
  	this.position.z = newZ;
  }

  // define a custom update function to be called on the cube each frame
  update( time ) {
  	

	this.noise = this.simplex.noise2D(this.progress, 0);

	this.dx = (Math.cos( (this.progress) ) * (this.radius * (this.noise ) )) ;//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // X distance from center - movement with speed
	this.dy = (Math.sin( (this.progress) ) * (this.radius * (this.noise ) )) ;//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // Y distance from center - movement with speed over time

	this.position.x = this.dx;
	this.position.y = this.dy;

	this.progress += this.velocity * this.speed;
	this.noiseAccum += 0.01 * this.noiseSpeed;
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
				'uniform float iHover;',
				'uniform float iDistance;',
				'uniform sampler2D iText0;',
				'uniform sampler2D iText1;',

				'varying vec2 vUv;',


				'void main()',
				'{',
					'vec2 p = -1.0 + 3.0 * vUv;',
					'vec2 q = p - vec2(0.5, 0.5);',// start pos

					'q.x += 0.;', // X distance from center - movement with speed
					'q.y += 0.;', // Y distance from center - movement with speed over time

					'float len = length(q);',

					'float a = atan( q.y, q.x ) / 3.1416  ;',  //speed of rotation
					'float b = atan( q.y, q.x ) / 3.1416  ;', //speed of rotation
					'float r1 = (0.01*iHover) / len + iTime;', // remove the / for reverse whirlpool
					'float r2 = (0.1*iHover) / len + iTime;',
					// 'float r1 = 0.3 / len + iTime * 0.5;',
					// 'float r2 = 0.5 / len + iTime * 0.5;',

					'float m = (cos(.5 ) + sin(iHover * .9)) / .5;',

					'vec4 tex1 = texture2D(iText0, vec2( a, r1 ));', // remove a to remove slice
					'vec4 tex2 = texture2D(iText1, vec2( b, r2 ));',// remove b to remove slice

					// 'vec4 tex1 = texture2D(iText0, vec2(a + 0.1 / len, r1 ));',
					// 'vec4 tex2 = texture2D(iText1, vec2(b + 0.1 / len, r2 ));',

					'vec3 col = vec3(mix(tex1, tex2, m));',
					// 'vec3 col = vec3(tex1));',
					'vec3 d = col * len * 0.5 * iDistance;',
					'gl_FragColor = vec4(d, 1.0);',
				'}',
			].join("\n")

		};

// fragmentShader: [
// 		'precision highp float;',

// 		'uniform float iTime;',
// 		'uniform float iDistance;',
// 		'uniform sampler2D iText0;',
// 		'uniform sampler2D iText1;',

// 		'varying vec2 vUv;',

// 		'void main()',
// 		'{',
// 			'vec2 p = -1.0 + 2.0 * vUv;',
// 			'vec2 q = p - vec2(0.5, 0.5);',// start pos

// 			// 'q.x += 0.4 - sin((iTime * 0.) * 0.9) * 0.2;', // X distance from center - movement with speed
// 			// 'q.y += 0.3 - cos((iTime * 0.) * 0.9) * 0.2;', // Y distance from center - movement with speed over time

// 			'q.x += 0.2;', // X distance from center - movement with speed
// 			'q.y += 0.2;', // Y distance from center - movement with speed over time

// 			'float len = length(q);',

// 			'float a = atan( q.y, q.x ) / 3.1416;',  //speed of rotation
// 			'float b = atan( q.y, q.x ) / 3.1416;', //speed of rotation
// 			'float r1 = 0.3 / len + iTime * 0.35;', // remove the / for reverse whirlpool
// 			'float r2 = 0.5 / len + iTime * 0.35;',
// 			// 'float r1 = 0.3 / len + iTime * 0.5;',
// 			// 'float r2 = 0.5 / len + iTime * 0.5;',

// 			'float m = (1. + sin(iTime * 0.9)) / 1.0;',

// 			'vec4 tex1 = texture2D(iText0, vec2( a, r1 ));', // remove a to remove slice
// 			'vec4 tex2 = texture2D(iText1, vec2( b, r2 ));',// remove b to remove slice

// 			// 'vec4 tex1 = texture2D(iText0, vec2(a + 0.1 / len, r1 ));',
// 			// 'vec4 tex2 = texture2D(iText1, vec2(b + 0.1 / len, r2 ));',

// 			'vec3 col = vec3(mix(tex1, tex2, m));',
// 			// 'vec3 col = vec3(tex1));',
// 			'vec3 d = col * len * 0.5 * iDistance;',
// 			'gl_FragColor = vec4(d, 1.0);',
// 		'}',
// 	].join("\n")

		this.particleSpriteTex = THREE.ImageUtils.loadTexture("assets/images/texture.png");

		var tuniform = {
			iTime: { type: 'f', value: 0.1 },
			iText0: { type: 't', value: THREE.ImageUtils.loadTexture( 'assets/images/textures/moon.jpg') },
			iText1: { type: 't', value: THREE.ImageUtils.loadTexture( 'assets/images/textures/moon.jpg' ) },
			iDistance: { type: 'f', value: 5 },
			iHover: { type: 'f', value: 3 }
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
  		let xPos = event.touches ? event.touches[0].pageX : event.clientX;
  		let yPos = event.touches ? event.touches[0].pageY : event.clientY;
		this.mouse.x = ( xPos / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( yPos / window.innerHeight ) * 2 + 1;
	}

	// browser resize handler
	onWindowResize(){
		// update camera
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		console.log ( 'this.spinShader', this.scene );

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

		this.scene.traverse( child => {
			if( child.update !== undefined ) {
				child.update( time, delta )
			}
		});

		this.camera.updateMatrixWorld();

		this.raycaster.setFromCamera( this.mouse, this.camera );
		this.intersects = this.raycaster.intersectObjects( this.scene.children, true );
		
		this.out();
		if ( this.intersects[1] ) {
			let mesh = this.intersects.filter( obj => {return obj.object.superName != 'SpinShader'} );
			if ( mesh.length > 0 ){
				this.over();
			} 
		}

		// render the scene
		this.renderer.render( this.scene, this.camera );

		// subscribe to the next frame event
		requestAnimationFrame( () => this.animate() );
	}

	over () {
		this.spinshader.setSpeed( 9 );
		this.spinText.setSpeed( .5 );
	}

	out () {
		this.spinshader.setSpeed( 3 );
		this.spinText.setSpeed( 1 );
	}


}

