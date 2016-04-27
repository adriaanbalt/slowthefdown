var _ = require('underscore')
  , THREE = require('three');

// ThreeScene constructor
var ThreeScene = function() {
  this.setup();
  this.animate();
}

// setup function
ThreeScene.prototype.setup = function() {

  // create the scene
  this.scene = new THREE.Scene();

  // add some unused fog by default
  // this.scene.fog = new THREE.FogExp2( 0xffffff, 0 );

  // create the camera
	this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, .1, 100 );

  // pull back from the center by 5 meters
  this.camera.position.z = 5;

  // configure the lens (50mm lens on 35mm camera)
	this.camera.setLens(50, 43.25);

  // add the camera to the scene
	this.scene.add( this.camera );

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

  // add canvas to the document
  document.body.appendChild( this.renderer.domElement );

}

// browser resize handler
ThreeScene.prototype.onWindowResize = function(){

  // update camera
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();

  // update renderer
  this.renderer.setSize( window.innerWidth, window.innerHeight );

}


// add function helper - maps to local scene add function
ThreeScene.prototype.add = function( child ) {

  this.scene.add( child );

}

// remove function helper
ThreeScene.prototype.remove = function( child ) {

  this.scene.remove( child );

}


// render function
ThreeScene.prototype.render = function() {

  this.renderer.render( this.scene, this.camera );

}

// animate function - gets calls each frame
ThreeScene.prototype.animate = function() {

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


module.exports = ThreeScene;
