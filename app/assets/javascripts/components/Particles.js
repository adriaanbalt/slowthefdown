var glslify = require('glslify'); // this has to be required separately for some reason

// REQUIREMENTS
var THREE = require('three')
  , GPUParticleSystem = require('./GPUParticleSystem.js')
  , ThreeScene = require('./ThreeScene.js');

// create a new ThreeJS Scene
var scene = new ThreeScene();
scene.camera.position.z = 50;

// create a dim ambient light
var ambientLight = new THREE.AmbientLight( 0x555555 );
scene.add( ambientLight );

// and a brighter point light slightly off center
var pointLight = new THREE.PointLight( 0xffeedd );
pointLight.position.set( 1, 2, 2 );
scene.add( pointLight );

var p = new GPUParticleSystem({
  maxParticles: 1000000
});
scene.add( p );

var clock = new THREE.Clock( true );

// options passed during each spawned
var particleOptions = {
  position: new THREE.Vector3(),
  positionRandomness: .5,
  velocity: new THREE.Vector3(),
  velocityRandomness: .1,
  color: 0xaa88ff,
  colorRandomness: .5,
  turbulence: .5,
  lifetime: 2,
  size: 15,
  sizeRandomness: 5
};

spawnerOptions = {
  spawnRate: 100,
  horizontalSpeed: 1.5,
  verticalSpeed: 2.33,
  timeScale: 1
}

var colors = [0xaa88ff, 0x6699aa, 0xddbb88];

var tick = 0;

function frameUpdate() {

  var delta = clock.getDelta() * .5
  tick += delta;

  particleOptions.color = colors[0];

  particleOptions.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 15;
  particleOptions.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;

  for( var i = 0; i < spawnerOptions.spawnRate; i++) {
    p.spawnParticle( particleOptions );
  }

  particleOptions.color = colors[1];

  particleOptions.position.x = Math.sin((tick + 2) * spawnerOptions.horizontalSpeed) * 20;
  particleOptions.position.y = Math.sin((tick + 2) * spawnerOptions.verticalSpeed) * 10;

  for( var i = 0; i < spawnerOptions.spawnRate; i++) {
    p.spawnParticle( particleOptions );
  }

  particleOptions.color = colors[2];

  particleOptions.position.x = Math.sin((tick + 4) * spawnerOptions.horizontalSpeed) * 20;
  particleOptions.position.y = Math.sin((tick + 4) * spawnerOptions.verticalSpeed) * 10;

  for( var i = 0; i < spawnerOptions.spawnRate; i++) {
    p.spawnParticle( particleOptions );
  }

  p.update(tick);

  requestAnimationFrame( frameUpdate );
}

frameUpdate();

window.scene = scene;
window.THREE = THREE;
