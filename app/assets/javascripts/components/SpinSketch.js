// REQUIREMENTS
import THREE from 'three';
import SpinText from './SpinText';

export default class SpinScene extends THREE.Scene {

    constructor() {
        super();
        // add some unused fog by default
        // this.fog = new THREE.FogExp2( 0x000000, .07 );

        // create the camera
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, .1, 100000 );
        this.camera.position.z = 1000;

        // add the camera to the scene
        this.add( this.camera );

        // create the renderer
        this.renderer = new THREE.WebGLRenderer();

        // enable retina resolution if available
        this.renderer.setPixelRatio( window.devicePixelRatio || 1 );

        // set the renderer to be the full size of our browser window
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // create a clock for this scene
        this.clock = new THREE.Clock( true );

        // subscribe to resize events
        window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
        this.onWindowResize();

        // add the Three.js canvas to the document
        document.body.appendChild( this.renderer.domElement );

        // fire the first animate call
        this.animate();
    }

    // browser resize handler
    onWindowResize(){
        // update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

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
        this.traverse( child => {
            if( child.update !== undefined ) {
                child.update( time, delta, this.freqData )
            }
        });

        // render the scene
        this.renderer.render( this, this.camera );

        // subscribe to the next frame event
        requestAnimationFrame( () => this.animate() );
    }
}

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
		// Custom vertex and fragement shader
		this.shape = new THREE.Mesh( geo, this.shaderMat );
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



export default class SpinSketch {

	constructor(){
		// create a new ThreeJS Scene
		let scene = new SpinScene();

		// create a dim ambient light
		let ambientLight = new THREE.AmbientLight( 0x555555 );
		scene.add( ambientLight );

		// and a brighter point light slightly off center
		let pointLight = new THREE.PointLight( 0xffeedd );
		pointLight.position.set( 0, 0, 800 );
		scene.add( pointLight );

	  	this.mat = new THREE.MeshPhongMaterial({
	  	  color: 0xFFFFFF,
	  	  // map: THREE.ImageUtils.loadTexture('assets/textures/uv.jpg'),
	  	  shininess: 1
	  	});


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

				    'float a = atan(q.y, q.x) + iTime * 0.5;', 
				    'float b = atan(q.y, q.x) + iTime * 0.5;',
				    'float r1 = 0.3 / len + iTime * 0.5;',
				    'float r2 = 0.5 / len + iTime * 0.5;',

				    'float m = (1. + sin(iTime * 0.1)) / 2.0;',
				    'vec4 tex1 = texture2D(iText0, vec2(a + 0.1 / len, r1 ));',
				    'vec4 tex2 = texture2D(iText1, vec2(b + 0.1 / len, r2 ));',
				    'vec3 col = vec3(mix(tex1, tex2, m));',
				    // 'vec3 col = vec3(tex1));',
				    'vec3 d = col * len * 0.5 * iPulse;',
				    'gl_FragColor = vec4(d, 1.0);',
				'}',
			].join("\n")

		};

  		this.particleSpriteTex = THREE.ImageUtils.loadTexture("assets/images/texture.png");

  		console.log ( 'this.particleSpriteTex', this.particleSpriteTex );
  		
  		var tuniform = {
	        iTime: { type: 'f', value: 0.1 },
	        iText0: { type: 't', value: THREE.ImageUtils.loadTexture( 'assets/images/texture.png') },
	        iText1: { type: 't', value: THREE.ImageUtils.loadTexture( 'assets/images/texture.png' ) },
	        iPulse: { type: 'f', value: 4 }
	    };

	    tuniform.iText0.value.wrapS = tuniform.iText0.value.wrapT = THREE.RepeatWrapping;
		tuniform.iText1.value.wrapS = tuniform.iText1.value.wrapT = THREE.RepeatWrapping;

		let geo = new THREE.PlaneGeometry( (window.innerWidth*2.5), (window.innerHeight*2.5), 1 , 1 );
		console.log ( 'size:', window.innerWidth, window.innerHeight, window, geo );
		this.particleShaderMat = new THREE.ShaderMaterial({
			uniforms: tuniform,
			vertexShader: GPUParticleShader.vertexShader,
			fragmentShader: GPUParticleShader.fragmentShader,
			side:THREE.DoubleSide
		});

		this.spinshader = new SpinShader( geo, this.particleShaderMat );
    	scene.add( this.spinshader );


		let fontLoader = new THREE.FontLoader();
		console.log ( 'fontLoader', fontLoader, this.font );
		fontLoader.load( '/assets/fonts/helvetiker_bold.typeface.js', ( response ) => {
			this.font = response;
			this.geo = new THREE.TextGeometry( "F",{
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
			this.f = new SpinText( this.geo, this.mat );
			scene.add( this.f );
		});

  		// font — THREE.Font.
		// size — Float. Size of the text.
		// height — Float. Thickness to extrude text. Default is 50.
		// curveSegments — Integer. Number of points on the curves. Default is 12.
		// bevelEnabled — Boolean. Turn on bevel. Default is False.
		// bevelThickness — Float. How deep into text bevel goes. Default is 10.
		// bevelSize — Float. How far from text outline is bevel. Default is 8.


	}
}
