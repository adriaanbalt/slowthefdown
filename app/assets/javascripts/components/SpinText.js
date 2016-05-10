import THREE from 'three';
// import Vector4 from "Vector4";

export default class SpinText extends THREE.Mesh {

  constructor( geo, mat) {
    super( geo, mat );

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

  // define a custom update function to be called on the cube each frame
  update( time ) {

    // if ( this.intersects.length > 0 ) {
    //   if ( INTERSECTED != this.intersects[ 0 ].object ) {
    //     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    //     INTERSECTED = this.intersects[ 0 ].object;
    //     INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
    //     INTERSECTED.material.emissive.setHex( 0xff0000 );
    //   }
    // } else {
    //   if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    //   INTERSECTED = null;
    // }

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

    this.vx = Math.random() * 0.5;
    this.vy = Math.random() * 0.5;
   
    this.dx = (Math.sin( (time * this.speed )) * 200) ; // X distance from center - movement with speed
    this.dy = (Math.cos( (time * this.speed )) * 200) ; // Y distance from center - movement with speed over time

    this.position.x = this.dx;
    this.position.y = this.dy;
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

  // getRandomColor() {
  //     let letters = 'FFF'.split('');
  //     let color = '#';
  //     for (let i = 0; i < 6; i++ ) {
  //         color += letters[Math.floor(Math.random() * 16)];
  //     }
  //     return color;
  // }

  // update2() {
  //   'vColor = encode_float( particleVelColSizeLife.y );',

  //   '// convert our velocity back into a value we can use',
  //   'vec4 velTurb = encode_float( particleVelColSizeLife.x );',
  //   'vec3 velocity = THREE.Vector( velTurb.xyz );',
  //   'float turbulence = velTurb.w;',

  //   'vec3 newPosition;',

  //   'float timeElapsed = uTime - particlePositionsStartTime.a;',

  //   'lifeLeft = 1. - (timeElapsed / particleVelColSizeLife.w);',

  //   'gl_PointSize = ( uScale * particleVelColSizeLife.z ) * lifeLeft;',

  //   'velocity.x = ( velocity.x - .5 ) * 3.;',
  //   'velocity.y = ( velocity.y - .5 ) * 3.;',
  //   'velocity.z = ( velocity.z - .5 ) * 3.;',

  //   'newPosition = particlePositionsStartTime.xyz + ( velocity * 10. ) * ( uTime - particlePositionsStartTime.a );',

  //   'vec3 noise = texture2D( tNoise, vec2( newPosition.x * .015 + (uTime * .05), newPosition.y * .02 + (uTime * .015) )).rgb;',
  //   'vec3 noiseVel = ( noise.rgb ) * 30.;',

  //   'newPosition = mix(newPosition, newPosition + vec3(noiseVel * ( turbulence * 5. ) ), (timeElapsed / particleVelColSizeLife.a) );',

  //   'if( velocity.y > 0. && velocity.y < .05 ) {',
  //       'lifeLeft = 0.;',
  //   '}',

  //   'if( velocity.x < -1.45 ) {',
  //       'lifeLeft = 0.;',
  //   '}',

  //   'if( timeElapsed > 0. ) {',
  //       'gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );',
  //   '} else {',
  //       'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
  //   'lifeLeft = 0.;',
  //       'gl_PointSize = 0.;',
  //   '}',
  // }

}
