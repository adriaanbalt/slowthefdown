import _ from 'lodash';
import THREE from 'three';

export default class SpinScene extends THREE.Scene {

    constructor() {
        super();
        // add some unused fog by default
        // this.fog = new THREE.FogExp2( 0x000000, .07 );

        // create the camera
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, .1, 100000 );
        this.camera.position.z = 400;

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



// import _ from 'lodash'
// import THREE from 'three';

// export default class SpinScene extends THREE.scene {

//   constructor() {
//     super();
//     // add some unused fog by default
//     // this.fog = new THREE.FogExp2( 0x000000, .07 );

//     console.log ( 'window.innerWidth / window.innerHeight', window.innerWidth / window.innerHeight );
//     // create the camera
//   	this.camera = new THREE.PerspectiveCamera( 150, window.innerWidth / window.innerHeight, .5, 1000);

//     // pull back from the center by 5 meters
//     this.camera.position.z = 15;

//     // configure the lens (50mm lens on 35mm camera)
//   	this.camera.setLens(50, 43.25);

//     // add the camera to the scene
//   	this.add( this.camera );

//     // setup trackball controls with some sane defaults
//     // this.controls = new THREE.TrackballControls( this.camera );
//     // this.controls.rotateSpeed = 3.0;
//     // this.controls.zoomSpeed = 1.2;
//     // this.controls.panSpeed = 0.8;
//     // this.controls.dynamicDampingFactor = 0.3;

//     // create the renderer
//     this.renderer = new THREE.WebGLRenderer();

//     // enable retina resolution if available
//     this.renderer.setPixelRatio( window.devicePixelRatio || 1 );

//     // set the renderer to be the full size of our browser window
//     this.renderer.setSize( window.innerWidth, window.innerHeight );

//     // create a clock for this scene
//     this.clock = new THREE.Clock( true );

//     // subscribe to resize events
//     window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );

//     // add the Three.js canvas to the document
//     document.body.appendChild( this.renderer.domElement );

//     this.animate();
//   }

//   // animate function - gets calls each frame
//   animate() {

//     // get the time elapsed since the start of the scene
//     var delta = this.clock.getDelta();
//     var time = this.clock.getElapsedTime();

//     // update any children with an 'update' method defined, and pass them the
//     // time elapsed since the start of the scene, if they need it
//     this.traverse( function( child ) {
//       if( child.update !== undefined ) child.update( time, delta );
//     }.bind( this ) );

//     // update the trackball controls
//     // this.controls.update();

//     // render the scene
//     this.renderer.render( this, this.camera );

//     // subscribe to the next frame event
//     requestAnimationFrame( this.animate.bind( this ) );

//   }

// }
