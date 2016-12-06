// REQUIREMENTS
import THREE from 'three';
import SimplexNoise from 'simplex-noise';
import Config from './Config';

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
		this.speed = 1;
		this.progress = 0;
		this.superName = "SpinShader";
		this.textPosition = {x:-1,y:-1}
	}

	setSpeed( speed, textPosition, progress ) {
		this.speed = speed;
		this.textPosition = textPosition;
		this.progress = progress/10000;
	}

	update( time, mouseX, mouseY ) {
		// console.log ( 'this.progress', this.progress )
		this.shaderMat.uniforms['iTime'].value = time;
		this.shaderMat.uniforms['iProgress'].value = this.progress;
		this.shaderMat.uniforms['iSpeed'].value = this.speed;
		this.shaderMat.uniforms['iMouseX'].value = this.textPosition.x/500;
		this.shaderMat.uniforms['iMouseY'].value = this.textPosition.y/500;
		this.position.z = 0;
	}
}


export default class SpinText extends THREE.Object3D {

  constructor( texture, cb ) {
		super();

		this.texture = texture;

		this.superName = "FText";

		this.simplex = new SimplexNoise(Math.random);

		this.mat = new THREE.MeshPhongMaterial({
		  // color: 0xFFFFFF,
		  map: this.texture,
		  shininess: 1
		});

		// let fontLoader = new THREE.FontLoader();
		// fontLoader.load( Config.letter.font, ( response ) => {
		// 	this.font = response;
		// 	// this.geo = new THREE.TextGeometry( "HappyClouds",{
		// 	// 	font: this.font,
		// 	// 	size: 70,
		// 	// 	height: 10,
		// 	// 	curveSegments: 4,
		// 	// 	bevelThickness: 1,
		// 	// 	bevelSize: 0,
		// 	// 	bevelEnabled: true,
		// 	// 	material: 0,
		// 	// 	extrudeMaterial: 0
		// 	// });
		// 	this.geo = new THREE.PlaneGeometry( 100, 100 );
		// 	this.fTxt = new THREE.Mesh( this.geo, this.mat );
		// 	this.add( this.fTxt );
		// 	cb();
		// });
		this.geo = new THREE.PlaneGeometry( 100, 100 );
		this.fTxt = new THREE.Mesh( this.geo, this.mat );
		this.add( this.fTxt );
		cb();

		let geometry = new THREE.CircleGeometry( 47, 10 );
		let hitMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.0 } );
		hitMaterial.transparent = true;

		this.circle = new THREE.Mesh( geometry, hitMaterial );
		this.circle.position.x = 25;
		this.circle.position.y = 35;
		this.add( this.circle );

		this.overProgress = 0;
		this.progress = 0;
		this.velocity = 0.005;
		// this.velocity = .04;// + .0001 * (1 - window.innerWidth/2000);
		this.radius = 500;
		this.noiseAccum = 0;
		this.speed = .25;
		this.isOver = false;

		this.position.set( 50, 50, 0 );
  }


  setScale( scale ) {
  	console.log ( 'setScale' , scale )
  	this.scale.x = scale;
  	this.scale.y = scale;
  }

  setVelocity( newVelocity ) {
  	this.velocity = newVelocity;
  }

  setSpeed( newSpeed, isOver, overProgress ) {
  	this.speed = newSpeed;
  	this.isOver = isOver;
  	this.overProgress = overProgress;
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
		this.noise = this.simplex.noise2D(this.progress, 10);
		this.dx = (this.progress * this.radius  );//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // X distance from center - movement with speed
		this.dy = (this.progress * this.radius  );//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // Y distance from center - movement with speed over time
		this.position.x = this.dx;
		this.position.y = this.dy;
		// this.setScale( Math.cos( (this.progress) ) )
		// this.rotation.x += 0.1;
		// this.rotation.y += 0.1;
		// this.rotation.z += 0.1;
		this.progress += this.velocity;
		this.noiseAccum += 0.01 * this.noiseSpeed;

		// this.material.color.setRGB (100, 100, 100);
		
		// let newCol = this.colorAnim( "#FFFFFF", "#f83b87", this.overProgress)
		this.mat.color.setHex(0xFFFFFF);

		// if ( this.isOver ) {
			this.speed += time/500;
		// }
  }
}

export default class HappyClouds {

	constructor( overFn, outFn ){

		this.overFn = overFn;
		this.outFn	= outFn;

		this.totalTextureLoaded = 0;
		this.overText = true;
		this.scene = new THREE.Scene();

		this.mouse = new THREE.Vector2();
		this.reset()
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
				'uniform float iProgress;',
				'uniform float iSpeed;',
				'uniform float iDistance;',
				'uniform float iMouseX;',
				'uniform float iMouseY;',
				'uniform sampler2D iText0;',
				'uniform sampler2D iText1;',
				'uniform sampler2D iText2;',

				'varying vec2 vUv;',


				'void main()',
				'{',
					'vec2 p = -1.0 + 3.0 * vUv;',
					'vec2 q = p - vec2(0.5, 0.5);',// start pos

					// 'q.x += 0. + sin(iTime * .5) / 1.;', // X distance from center - movement with speed
					// 'q.y += 0. + sin(iTime * .5) / 1.;', // Y distance from center - movement with speed over time

					'q.x += iMouseX;', // Y distance from center - movement with speed over time
					'q.y += iMouseY;', // Y distance from center - movement with speed over time

					'float len = length(q);',

					'float a = atan( q.y, q.x ) / 3.1416  ;',  //speed of rotation
					'float b = atan( q.y, q.x ) / 3.1416  ;', //speed of rotation
					'float c = atan( q.y, q.x ) / 13.1416  ;', //speed of rotation
					'float r1 = ((0.1+iProgress)*iSpeed) / len + iTime;', // remove the / for reverse whirlpool
					'float r2 = ((0.1)*iSpeed) / len + iTime ;',
					// 'float r1 = 0.3 / len + iTime * 0.5;',
					// 'float r2 = 0.5 / len + iTime * 0.5;',

					'float m = (cos(.5 ) + sin(.9)) / .5 ;',

					'vec4 tex1 = texture2D(iText0, vec2( a, r1 ));', // remove a to remove slice
					'vec4 tex2 = texture2D(iText1, vec2( b, r2 ));',// remove b to remove slice
					// 'vec4 tex3 = texture2D(iText2, vec2( c, r2 ));',// remove b to remove slice

					// 'vec4 tex1 = texture2D(iText0, vec2(a + 0.1 / len, r1 ));',
					// 'vec4 tex2 = texture2D(iText1, vec2(b + 0.1 / len, r2 ));',

					'vec3 col = vec3(mix(tex1, tex2, m));',
					// 'vec3 col = vec3(mix(col, tex3, m));',
					// 'vec3 col = vec3(tex1));',
					'vec3 d = col * len * 0.5 * iDistance;',
					'gl_FragColor = vec4(d, 1.0);',
				'}',
			].join("\n")

		};


		this.loadTextureByName( Config.textures.cloud, (texture)=>this.textureLoaded(texture) );


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

	loadTextureByName( txt, callback ) {
		let child;
		for( let i = this.scene.children.length - 1; i >= 0; i--) {
		     child = this.scene.children[i];
		     this.scene.remove(child);
		}

		this.loader = new THREE.TextureLoader();
		this.loader.load( 
			txt,
			( texture ) => callback( texture ),
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

	textureLoaded ( textureImg ) {

		this.scene.add( this.ambientLight );
		this.scene.add( this.pointLight );

		console.log ( 'textureLoaded', textureImg )

		// var tuniform = {
		// 	iTime: { type: 'f', value: 0.1 },
		// 	iProgress: { type: 'f', value: 0.0 },
		// 	iText0: { type: 't', value: this.textureOne },
		// 	iText1: { type: 't', value: this.textureOne },
		// 	iText2: { type: 't', value: this.textureTwo },
		// 	iDistance: { type: 'f', value: 5 },
		// 	iMouseX: { type: 'f', value: 1 },
		// 	iMouseY: { type: 'f', value: 1 },
		// 	iSpeed: { type: 'f', value: 1 }
		// };

		// tuniform.iText0.value.wrapS = tuniform.iText0.value.wrapT = THREE.RepeatWrapping;
		// tuniform.iText1.value.wrapS = tuniform.iText1.value.wrapT = THREE.RepeatWrapping;
		// tuniform.iText2.value.wrapS = tuniform.iText2.value.wrapT = THREE.RepeatWrapping;

		let geo = new THREE.PlaneGeometry( (window.innerWidth), (window.innerHeight) );
		// let geo = new THREE.SphereGeometry( 1000, 16, 32 );
		// this.particleShaderMat = new THREE.ShaderMaterial({
		// 	uniforms: tuniform,
		// 	vertexShader: this.shader.vertexShader,
		// 	fragmentShader: this.shader.fragmentShader,
		// 	side:THREE.DoubleSide
		// });
		// this.spinshader = new SpinShader( geo, this.particleShaderMat );
		// this.spinshader.position.z = -1000;

		// this.spinText = new SpinText(textureImg, () => this.animate());
		// // this.scene.add( this.spinshader );
		// this.scene.add( this.spinText );
		window.setTimeout( () => this.createCloud( textureImg ), 1000 )

		// add the camera to the scene
		this.scene.add( this.camera );

		window.onblur = () => {
			this.reset();
			this.deltaTime = 0;
			this.spinText.setSpeed( 0 );
		};

		this.onWindowResize();
	}

	createCloud ( textureImg ) {
		console.log ( 'createCloud', textureImg )
		this.spinText = new SpinText(textureImg, () => this.animate());
		// this.scene.add( this.spinshader );
		this.scene.add( this.spinText );
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
		this.reset();
	}

	reset() {
		this.mouse.x = 1;
		this.mouse.y = -1;	
	}

	// browser resize handler
	onWindowResize(){
		// update camera
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		// this.spinText.setRadius( ((window.innerWidth)/4) )
		// this.spinText.setScale( 1 );

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
				child.update( time, this.mouse.x, this.mouse.y )
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

		// this.spinText.setScale( 0 )
		// this.spinshader.setSpeed( 3, this.spinText.position, this.deltaTime );
		
		// increment speed by progress so it slowly gets harder
		// this.spinText.setSpeed( (.5+this.deltaTime/100000), true, this.deltaTime/10000); 
	}

	out () {
		if ( !this.overText ) {
			this.endTime = Date.now();
			this.deltaTime = (this.endTime - this.startTime);
			this.startTime = null;
			this.overText = true;
			this.outFn( this.deltaTime );
		}
		// this.spinshader.setSpeed( 1, this.spinText.position, 0 );
		// this.spinText.setSpeed( .25, false, 0 );
	}


}

