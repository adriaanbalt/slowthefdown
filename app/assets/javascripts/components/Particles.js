// var glslify = require('glslify'); // this has to be required separately for some reason

// REQUIREMENTS
import THREE from 'three'
import ParticlesSystem from './ParticlesSystem.js'
import ParticlesScene from './ParticlesScene.js';

export default class Particles {

  constructor(){
    // create a new ThreeJS Scene
    this.scene = new ParticlesScene();

    this.scene.camera.position.z = 50;

    // create a dim ambient light
    var ambientLight = new THREE.AmbientLight( 0x555555 );
    this.scene.add( ambientLight );

    // and a brighter point light slightly off center
    var pointLight = new THREE.PointLight( 0xffeedd );
    pointLight.position.set( 1, 2, 2 );
    this.scene.add( pointLight );

    this.system = new ParticlesSystem({
      maxParticles: 2
    });
    this.scene.add( this.system );

    this.clock = new THREE.Clock( true );

    // options passed during each spawned
    this.particleOptions = {
      position: new THREE.Vector3(),
      positionRandomness: 0,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0,
      color: 0xaa88ff,
      colorRandomness: 0,
      turbulence: 0,
      lifetime: 1,
      size: 20,
      sizeRandomness: 0
    };

    this.spawnerOptions = {
      spawnRate: 1,
      horizontalSpeed: 1.5,
      verticalSpeed: 2.33,
      timeScale: 1
    }

    this.colors = [0xaa88ff];

    this.tick = 0;

    this.animate();
  }

  animate() {

    let delta = this.clock.getDelta() * .5
    this.tick += delta;

    this.particleOptions.color = this.colors[0];

    this.particleOptions.position.x = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed) * 15;
    this.particleOptions.position.y = Math.sin(this.tick * this.spawnerOptions.verticalSpeed) * 10;

    for( var i = 0; i < this.spawnerOptions.spawnRate; i++) {
      this.system.spawnParticle( this.particleOptions );
    }

    this.particleOptions.color = this.colors[1];

    this.particleOptions.position.x = Math.sin((this.tick + 2) * this.spawnerOptions.horizontalSpeed) * 20;
    this.particleOptions.position.y = Math.sin((this.tick + 2) * this.spawnerOptions.verticalSpeed) * 10;

    for( var i = 0; i < this.spawnerOptions.spawnRate; i++) {
      this.system.spawnParticle( this.particleOptions );
    }

    this.particleOptions.color = this.colors[2];

    this.particleOptions.position.x = Math.sin((this.tick + 4) * this.spawnerOptions.horizontalSpeed) * 20;
    this.particleOptions.position.y = Math.sin((this.tick + 4) * this.spawnerOptions.verticalSpeed) * 10;

    for( var i = 0; i < this.spawnerOptions.spawnRate; i++) {
      this.system.spawnParticle( this.particleOptions );
    }

    this.system.update(this.tick);

    requestAnimationFrame( this.animate.bind( this ) );
  }

}