import _ from 'lodash';
import THREE from 'three';

export default class ThreeScene extends THREE.Scene {

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
        var time = this.clock.getElapsedTime();

        // update any children with an 'update' method defined, and pass them the
        // time elapsed since the start of the scene, if they need it
        // _.each( this.scene.children, function( child ) {
        //   if( child.update !== undefined ) child.update( time );
        // }.bind( this ) );

        // render the scene
        this.render();

        // subscribe to the next frame event
        requestAnimationFrame( this.animate.bind( this ) );
    }
}
