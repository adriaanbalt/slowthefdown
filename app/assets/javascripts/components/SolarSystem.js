import THREE from 'three';
import _ from 'lodash';
import Planet from './SolarPlanet';

export default class System extends THREE.Object3D {

    constructor() {
        super();
        let PI_2 = Math.PI * 2;

        let textureEarth = new THREE.TextureLoader();
        // load a resource
        textureEarth.load(
            // resource URL
            '/assets/images/textures/earth.jpg',
            // Function when resource is loaded
            ( texture ) => this.loadEarth( texture ),
            // Function called when download progresses
            ( xhr ) => {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            ( xhr ) => {
                console.log( 'An error happened', xhr );
            }
        );

        let textureMoon = new THREE.TextureLoader();
        // load a resource
        textureMoon.load(
            // resource URL
            '/assets/images/textures/moon.jpg',
            // Function when resource is loaded
            ( texture ) => this.loadMoon( texture ),
            // Function called when download progresses
            ( xhr ) => {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            ( xhr ) => {
                console.log( 'An error happened', xhr );
            }
        );

    
        // add a light
        let light;
        light = new THREE.PointLight( 0xffff00, 4, 100 );
        light.position.set( 0, 0, 100 );
        this.add( light );
    }

    loadMoon( texture ) {
        console.log ( 'loadmoon' );
        let material = new THREE.MeshPhongMaterial({
            color: 0xeeeeee,
            map: texture,
            shininess: 1
        });

        let planetGeo = new THREE.SphereGeometry( 2.0, 20, 20 );
        let mesh = new THREE.Mesh( planetGeo, material );
        let pos = new THREE.Vector3( 50.0, 0, 0 );

        /*
        // SETS a random position around a sphere
        // random spherical rotation
        let theta = Math.random() * PI_2;
        let phi  = Math.random() * PI_2;
        pos.x = Math.sin(phi) * Math.sin(theta);
        pos.y = Math.sin(phi) * Math.cos(theta);
        pos.z = Math.cos(phi);
        // random distance within a range from center
        let randDist = (Math.random() * 25.0) + 25;
        pos.multiplyScalar(randDist);
        */

        // let mass = Math.random() * 10;

        this.planet = new Planet( mesh, pos, 2 );
        this.planet.velocity.x = 0.2;
        this.planet.velocity.y = 0.2;
        this.planet.velocity.z = 0.2;

        // this.planet.rotationVelocity.x = (Math.random() - 0.5) * 0.01;
        // this.planet.rotationVelocity.y = (Math.random() - 0.5) * 0.01;
        // this.planet.rotationVelocity.z = (Math.random() - 0.5) * 0.01;

        this.add( this.planet );
    }

    loadEarth( texture ) {
        console.log ( 'loadTexture', texture );
        // do something with the texture
        let material = new THREE.MeshPhongMaterial({
            color: 0xeeeeee,
            map: texture,
            shininess: 1
        });

        // material.bumpMap    = THREE.ImageUtils.loadTexture('assets/textures/venus.jpg')
        // material.bumpScale = 0.1;
        // material.specularMap = THREE.ImageUtils.loadTexture('assets/textures/venus.jpg')
        // material.specular  = new THREE.Color('grey');

        let geo = new THREE.SphereGeometry( 4.0, 30, 30 );
         // make a center planet sphere
        let planet = new THREE.Mesh( geo, material );
        this.add( planet );
        this.centerPlanet = new Planet( planet, new THREE.Vector3(), 1.0 );

        // set the speed of rotation of the center planet
        this.centerPlanet.rotationVelocity.x = 0.0;
        this.centerPlanet.rotationVelocity.y = (Math.random() - 0.5) * 0.01;
        this.centerPlanet.rotationVelocity.z = 0.0;
        this.add( this.centerPlanet );
    }

    // define a custom update function to be called on the planet each frame
    update( time, delta, audio ) {

        console.log ( "Update", this.centerPlanet, this.planet);

        // ATTRACT planets to eachother
        /*
        _.each( this.planets, function( planet2 ){
            if( planet != planet2 ){
                let force = planet2.attract( planet );
                 planet.applyForce( force );
            }
        }, this );
        */

        if ( this.centerPlanet && this.planet ){
            let force = this.centerPlanet.attract( this.planet );
            this.planet.applyForce( force );
            this.planet.applyUpdate();

            force = this.planet.attract( this.centerPlanet );
            this.centerPlanet.applyForce( force );
            this.centerPlanet.applyUpdate();
        }

        // this.centerPlanet.applyUpdate();
    }
}
