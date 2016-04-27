import THREE from 'three';
import _ from 'lodash';

export default class Planet extends THREE.Object3D{

    constructor ( mesh, loc, mass ) {
        super( mesh, loc, mass );
        // add mesh to object
        this.add( mesh );

        let massScale = THREE.Math.clamp( mass * 2.0, 1.0, 3.0 );
        this.mesh = mesh;
        this.gravity = 1.0;
        this.position.set( loc.x, loc.y, loc.z );
        this.mass = mass;
        this.acceleration = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.rotationVelocity = new THREE.Vector3();
        this.mesh.scale.set( massScale, massScale, massScale );
    }

    attract( p ){
        let force = new THREE.Vector3().subVectors( this.position, p.position );
        let d = force.length(); // Distance between objects
        d = THREE.Math.clamp( d, 1.0, 10.0 ); // Limiting the distance to eliminate "extreme" results for very close or very far objects
        force = force.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)

        let strength = ( this.gravity * this.mass * p.mass ) / (d * d);   // Calculate gravitional force magnitude
        force = force.multiplyScalar( strength ); // Get force vector --> magnitude * direction
        return force;
    }

    applyForce( force ){
        // return a new Vector, which is the force divided by mass
        let f = new THREE.Vector3( force.x, force.y, force.z );
        f.divideScalar( this.mass );
        this.acceleration.add( f );
    }

    applyUpdate(){
        // update velocity and position
        this.velocity.add( this.acceleration );
        this.position.add( this.velocity );

        // reset acceleration
        this.acceleration.multiplyScalar( 0 );

        // update rotation
        this.mesh.rotation.x += this.rotationVelocity.x;
        this.mesh.rotation.y += this.rotationVelocity.y;
        this.mesh.rotation.z += this.rotationVelocity.z;
    }
}
