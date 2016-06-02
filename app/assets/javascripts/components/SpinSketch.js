// REQUIREMENTS
import THREE from 'three';
import SimplexNoise from 'simplex-noise';
import Config from './Config';

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
		this.speed = 3;
		this.superName = "SpinShader";
	}

	setSpeed( speed ) {
		this.speed = speed;
	}

	update( time ) {
		this.shaderMat.uniforms['iTime'].value = time;
		this.shaderMat.uniforms['iHover'].value = this.speed;
		this.position.z = 0;
	}
}


export default class SpinText extends THREE.Object3D {

  constructor( cb ) {
	super();

	this.superName = "FText";

	this.simplex = new SimplexNoise(Math.random);

	this.mat = new THREE.MeshPhongMaterial({
	  color: Config.letter.color,
	  // map: THREE.ImageUtils.loadTexture('assets/textures/uv.jpg'),
	  shininess: 1
	});

	let fontLoader = new THREE.FontLoader();
	fontLoader.load( Config.letter.font, ( response ) => {
		this.font = response;
		this.geo = new THREE.TextGeometry( Config.letter.text,{
			font: this.font,
			size: 70,
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

	let geometry = new THREE.CircleGeometry( 47, 10 );
	let material = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.0 } );
	material.transparent = true;

	this.circle = new THREE.Mesh( geometry, material );
	this.circle.position.x = 25;
	this.circle.position.y = 35;
	this.add( this.circle );

	this.progress = 0 ;
	this.velocity = 0.01;
	this.radius = 500;
	this.noiseAccum = 0;
	this.speed = 1.5;

	this.position.set( 50, 50, 0 );
  }

  setScale( scale ) {
  	this.scale.x = scale;
  	this.scale.y = scale;
  }

  setVelocity( newVelocity ) {
  	this.velocity = newVelocity;
  }

  setSpeed( newSpeed ) {
  	this.speed = newSpeed;
  	console.log( 'newSpeed', newSpeed );
  }

  setNoiseSpeed( newSpeed ) {
  	this.noiseSpeed = newSpeed;
  }

  setDepth( newZ ) {
  	this.position.z = newZ;
  }

  setRadius( newRadius ) {
  	this.radius = newRadius;
  }

  update( time ) {
	this.noise = this.simplex.noise2D(this.progress, 0);
	this.dx = (Math.cos( (this.progress) ) * (this.radius * (this.noise ) )) ;//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // X distance from center - movement with speed
	this.dy = (Math.sin( (this.progress) ) * (this.radius * (this.noise ) )) ;//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // Y distance from center - movement with speed over time
	this.position.x = this.dx;
	this.position.y = this.dy;
	// this.rotation.x += 0.1;
	// this.rotation.y += 0.1;
	// this.rotation.z += 0.1;
	this.progress += this.velocity * this.speed;
	this.noiseAccum += 0.01 * this.noiseSpeed;
  }
}

export default class SpinSketch {

	constructor( overFn, outFn ){

		this.overFn = overFn;
		this.outFn	= outFn;

		this.overText = true;
		this.scene = new THREE.Scene();

		this.mouse = new THREE.Vector2();
		this.mouse.x = window.innerWidth + 100;
		this.mouse.y = window.innerWidth + 100;
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
		this.ambientLight = new THREE.AmbientLight( 0xFFFFFF );
		
		// and a brighter point light slightly off center
		this.pointLight = new THREE.PointLight( 0xFFFFFF );
		this.pointLight.position.set( 0, 0, 50 );

		this.shader = {

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

					// 'q.x += 0. + sin(iTime * .5) / 1.;', // X distance from center - movement with speed
					// 'q.y += 0. + sin(iTime * .5) / 1.;', // Y distance from center - movement with speed over time

					'float len = length(q);',

					'float a = atan( q.y, q.x ) / 3.1416  ;',  //speed of rotation
					'float b = atan( q.y, q.x ) / 3.1416  ;', //speed of rotation
					'float r1 = (0.01*iHover) / len + iTime;', // remove the / for reverse whirlpool
					'float r2 = (0.1*iHover) / len + iTime ;',
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


		this.loadTextureByName( Config.textures.stars );


		// font — THREE.Font.
		// size — Float. Size of the text.
		// height — Float. Thickness to extrude text. Default is 50.
		// curveSegments — Integer. Number of points on the curves. Default is 12.
		// bevelEnabled — Boolean. Turn on bevel. Default is False.
		// bevelThickness — Float. How deep into text bevel goes. Default is 10.
		// bevelSize — Float. How far from text outline is bevel. Default is 8.

		document.addEventListener( 'mousemove', (e)=> this.mouseMove(e), false );
		document.addEventListener( 'touchstart', (e)=> this.mouseMove(e), false)
		document.addEventListener( 'touchmove', (e)=> this.mouseMove(e), false)
		document.addEventListener( 'touchend', (e)=> this.moveEnd(e), false)

		// subscribe to resize events
		window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
	}

	loadTextureByName( txt ) {
		let child;
		for( let i = this.scene.children.length - 1; i >= 0; i--) {
		     child = this.scene.children[i];
		     this.scene.remove(child);
		}

		this.loader = new THREE.TextureLoader();
		this.loader.load( 
			txt,
			( texture ) => this.textureLoaded( texture ),
			// Function called when download progresses
			( xhr ) => {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			( xhr ) => {
				console.log( 'An error happened' );
			}
		)
	}

	textureLoaded( textureImg ){

		this.scene.add( this.ambientLight );
		this.scene.add( this.pointLight );


		var tuniform = {
			iTime: { type: 'f', value: 0.1 },
			iText0: { type: 't', value: textureImg },
			iText1: { type: 't', value: textureImg },
			iDistance: { type: 'f', value: 5 },
			iHover: { type: 'f', value: 3 }
		};

		tuniform.iText0.value.wrapS = tuniform.iText0.value.wrapT = THREE.RepeatWrapping;
		tuniform.iText1.value.wrapS = tuniform.iText1.value.wrapT = THREE.RepeatWrapping;

		let geo = new THREE.PlaneGeometry( (window.innerWidth), (window.innerHeight) );
		// let geo = new THREE.SphereGeometry( 1000, 16, 32 );
		this.particleShaderMat = new THREE.ShaderMaterial({
			uniforms: tuniform,
			vertexShader: this.shader.vertexShader,
			fragmentShader: this.shader.fragmentShader,
			side:THREE.DoubleSide
		});
		this.spinshader = new SpinShader( geo, this.particleShaderMat );
		this.spinshader.position.z = -1000;

		this.spinText = new SpinText(() => this.animate());
		this.scene.add( this.spinshader );
		this.scene.add( this.spinText );

		// add the camera to the scene
		this.scene.add( this.camera );

		this.onWindowResize();
	}

	start(){
		// add the Three.js canvas to the document
		document.getElementById('game').appendChild( this.renderer.domElement );
	}

	mouseMove( event ) {
		event.preventDefault();
		// get mouse or touch coordinates for raycaster
  		let xPos = event.touches ? event.touches[0].pageX : event.clientX;
  		let yPos = event.touches ? event.touches[0].pageY : event.clientY;
		this.mouse.x = ( xPos / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( yPos / window.innerHeight ) * 2 + 1;
	}

	moveEnd( event ) {
		this.mouse.x = window.innerWidth + 100;
		this.mouse.y = window.innerWidth + 100;
	}

	// browser resize handler
	onWindowResize(){
		// update camera
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.spinText.setRadius( (window.innerWidth)/2 )
		this.spinText.setScale( 1 );

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
		

		// this.out();
		let mesh = this.intersects.filter( obj => { return obj.object.superName != 'SpinShader'} );

		// if ( this.intersects[1] ) {
			if ( mesh.length > 0 ){
				this.over();
			} else {
				this.out();
			}
		// }

		// render the scene
		this.renderer.render( this.scene, this.camera );

		// subscribe to the next frame event
		requestAnimationFrame( () => this.animate() );
	}

	over () {
		if ( this.overText ) {
			this.startTime = Date.now();
			this.overText = false;
		}
		this.endTime = Date.now();
		this.deltaTime = (this.endTime - this.startTime);

		this.overFn( this.deltaTime );

		this.spinshader.setSpeed( 9 );
		this.spinText.setSpeed( .01 + .6 * (1 - window.innerWidth/2000) );
	}

	out () {
		if ( !this.overText ) {
			this.endTime = Date.now();
			this.deltaTime = (this.endTime - this.startTime);
			this.startTime = null;
			this.overText = true;
			this.outFn( this.deltaTime );
		}
		this.spinshader.setSpeed( 3 );
		this.spinText.setSpeed( 1.5 );
	}


}

