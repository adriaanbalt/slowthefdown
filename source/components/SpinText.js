import THREE from 'three';
import SimplexNoise from 'simplex-noise';
import Config from './Config';

export default class SpinText extends THREE.Object3D {

  constructor( cb ) {
    super();

    this.superName = "FText";

    this.simplex = new SimplexNoise(Math.random);

    this.mat = new THREE.MeshPhongMaterial({
      color: Config.letter.color,
      // map: THREE.ImageUtils.loadTexture('assets/textures/uv.jpg'),
      shininess: 1
    });

    let fontLoader = new THREE.FontLoader();
    fontLoader.load( Config.letter.font, ( response ) => {
      this.font = response;
      this.geo = new THREE.TextGeometry( Config.letter.text,{
        font: this.font,
        size: 70,
        height: 10,
        curveSegments: 4,
        bevelThickness: 1,
        bevelSize: 0,
        bevelEnabled: true,
        material: 0,
        extrudeMaterial: 0
      });
      this.fTxt = new THREE.Mesh( this.geo, this.mat );
      this.add( this.fTxt );
      cb();
    });

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
    this.speed = 1.5;
    this.isOver = false;

    this.position.set( 50, 50, 0 );
  }


  colorAnim(ori,dest,prog){
    var casergb;
    function toArr (s){
        if(s.charAt(0) !== 'r'){
            if(s.charAt(0)==='#') {s = s.slice(1);}
            if(s.length === 3) {s = ''.concat(s[0],s[0],s[1],s[1],s[2],s[2]);}
            var hex = parseInt(s,16);
            return [hex >> 16,hex >> 8 & 0xFF,hex & 0xFF];
        }else{
            casergb = s.slice(0,s.indexOf('('));
            return s.match(/[\d]+/g).map(function (n) {return parseInt(n,10);});
        }
    }
    var cori = toArr(ori);
    var cdest = toArr(dest);
    var cnow = []
    for(var i=0; i < 3; i++){
        cnow.push( (cori[i] + (cdest[i] - cori[i]) * prog) | 0);
    }
    if(casergb){
        if(casergb.length === 3){
            return casergb.concat('(',cnow[0],',',cnow[1],',',cnow[2], ')' );
        }else{
            return casergb.concat('(',cnow[0],',',cnow[1],',',cnow[2],',',cdest[3],')');
        }
    }else{
        return (0x1000000 | (cnow[0]<<16) | (cnow[1]<<8) | cnow[2]).toString(16).slice(1);
    }
  }


  setScale( scale ) {
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
    this.noise = this.simplex.noise2D(this.progress, 0);
    this.dx = (Math.cos( (this.progress) ) * (this.radius * (this.noise ) )) ;//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // X distance from center - movement with speed
    this.dy = (Math.sin( (this.progress) ) * (this.radius * (this.noise ) )) ;//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // Y distance from center - movement with speed over time
    this.position.x = this.dx;
    this.position.y = this.dy;
    // this.rotation.x += 0.1;
    // this.rotation.y += 0.1;
    // this.rotation.z += 0.1;
    this.progress += this.velocity * this.speed;
    this.noiseAccum += 0.01 * this.noiseSpeed;

    // this.material.color.setRGB (100, 100, 100);
    
    // let newCol = this.colorAnim( "#FFFFFF", "#f83b87", this.overProgress)
    this.mat.color.setHex(0xFFFFFF);

    // if ( this.isOver ) {
      this.speed += time/500;
    // }
  }
}
