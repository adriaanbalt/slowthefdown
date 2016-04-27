'use strict';

import PIXI from 'pixi.js';
import Vec2 from '../lib/utils/Vec2';

export default class Ftext {

  constructor( scene, size, overFn, outFn ){

    console.log ( 'Vec2', Vec2 );

    this.stage = new PIXI.Container();
    this.scene = scene;
    this.size = size;
    this.overFn = overFn;
    this.outFn = outFn;

    this.text = new PIXI.Text('F', { 
      font : '50px Arial', 
      fill : 0x000000
    });

    // array of sprites
    this.circle = new PIXI.Graphics();
    this.circle.beginFill( 0xFFFFFF );
    this.circle.drawCircle( 15, 28, 30 );
    this.circle.endFill();

    this.speed = 2;
    this.highscore = 0;
    this.overTime = 0;
    this.outTime = 0;
    this.once = true;

    this.stage.addChild( this.circle );
    this.stage.addChild( this.text );

    // this.location = new Vec2( 1, 1 );
    // this.gravity = new Vec2( 0, 0.1 );
    // this.velocity = new Vec2();
    // this.acceleration = new Vec2();
    // this.force = Vec2.div( this.gravity, 10 );   // return a new Vector, which is the force divided by mass
    // // this.mass = 10.0;                   // Add mass of an arbitrary unit
    // this.mass = m;                   // Mass is visually correllated with radius

    this.stage.interactive = true;    
    this.stage.mouseover = (e) => {
      this.speed = .5;
      if ( this.once ) {
        this.overTime = Date.now();
        this.once = false;
      }
      this.overFn();
    }
    this.stage.mouseout = (e) => {
      this.speed = 2;
      this.outTime = Date.now();
      this.highscore = (this.outTime - this.overTime )/ 1000;
      this.overTime = Date.now();
      this.outFn( this.highscore );
    }

    window.addEventListener('update', (e) => this.update(e), false );
  }

  // -----------------------------------------------------------------------------
  // UPDATE DRAWING HERE
  // -----------------------------------------------------------------------------
  update(e) {
    // this.acceleration.add( this.force );
    // this.velocity.add( this.acceleration );
    // this.location.add( this.velocity );
    // this.acceleration.mult( 0 );    // reset acceleration

    this.stage.rotation += 0.02;
    this.stage.position.x += this.speed;
    this.stage.position.y += this.speed;

    console.log ( 'this.location', this.location );

    // if( this.stage.position.x > this.size + 200 ){
    //   this.stage.position.x = -200;
    // }

    // if( this.stage.position.y > this.size + 200 ){
    //   this.stage.position.y = -200;
    // }


  }

}
