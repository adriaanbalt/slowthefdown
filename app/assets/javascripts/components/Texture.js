'use strict';

import PIXI from 'pixi.js';

export default class Texture  {

  constructor( scene, stage, size ){

    this.stage = stage;
    this.scene = scene;
    this.size = size;

    this.square = new PIXI.Graphics();
    this.square.beginFill( 0xFF00FF );
    this.square.drawRect( 0, 0, 300, 300);
    // this.square.pivot = new PIXI.Point(this.square.width/2, this.square.height/2);
    // this.square.position.x = 150;
    // this.square.position.y = 150;
    // this.square.rotation = 30.0;
    this.square.endFill();
    this.stage.addChild( this.square );

    // array of sprites
    this.circle = new PIXI.Graphics();
    this.circle.beginFill( 0xFFFFFF );
    this.circle.drawCircle( 0, 0, 100 );
    this.circle.endFill();
    let circleTex = this.circle.generateTexture();
    this.circles = [];
    let cSprite;

    for( let i = 0; i < 20; i++ ){
      cSprite = new PIXI.Sprite( circleTex );
      cSprite.position.x = Math.random() * this.size;
      cSprite.position.y = Math.random() * this.size;
      cSprite.tint = PIXI.utils.rgb2hex( [Math.random(), Math.random(), Math.random()] );
      cSprite.scale.x = cSprite.scale.y = (Math.random() * 0.5) + 0.2;
      cSprite.velX = (Math.random() - 0.5) * 5.0;
      cSprite.velY = (Math.random() - 0.5) * 5.0;

      // http://codepen.io/ianmcgregor/pen/CtjeI?editors=0010 // Blend modes
      cSprite.blendMode = PIXI.blendModes.ADD;
      this.circles.push(cSprite);
      this.stage.addChild(cSprite);
    }
    this.count = 0;

    // lets create moving shape
    this.path = new PIXI.Graphics();
    this.stage.addChild( this.path);
    this.path.position.x = this.size / 2;
    this.path.position.y = this.size / 2;

    // load an image
    let imageTex = PIXI.Texture.fromImage('assets/images/adriaan.jpg');
    this.image = new PIXI.Sprite( imageTex );
    this.image.anchor = new PIXI.Point( 0.5, 0.5 );
    // this.stage.addChild( this.image );

    window.addEventListener('update', (e) => this.update(e), false );
  }

  // -----------------------------------------------------------------------------
  // UPDATE DRAWING HERE
  // -----------------------------------------------------------------------------
  update(e) {
    this.square.rotation += 0.02;
    this.square.position.x += 3.0;

    if( this.square.position.x > this.size + 200 ){
      this.square.position.x = -200;
    }

    for( let i = 0; i < this.circles.length; i++ ){
      let circle = this.circles[i];
      let circleSize = circle.width;
      circle.position.x += 0.5;
      circle.position.y += 0.5;

      if(circle.position.x > this.size ){
        circle.position.x = -circleSize;
      }else if(circle.position.x < -circleSize ){
        circle.position.x = this.size;
      }

      if(circle.position.y > this.size ){
        circle.position.y = -circleSize;
      }else if(circle.position.y < -circleSize ){
        circle.position.y = this.size;
      }
    }

    this.path.rotation += 0.01;

    let range = 100;

    this.path.clear();
    this.path.lineStyle(30, 0xFFFFFF, 1);

    this.path.moveTo(0, Math.sin(this.count) * -50 );
    this.path.lineTo(100, Math.sin(this.count) * 50 );
    this.path.lineTo(200, Math.sin(this.count) * -50 );
    this.path.lineTo(300, Math.sin(this.count) * 50 );

    this.path.beginFill( 0xFFFFFF, .5);
    this.path.moveTo(-120 + Math.sin(this.count) * range, -100 + Math.cos(this.count)* range);
    this.path.lineTo(120 + Math.cos(this.count) * range, -100 + Math.sin(this.count)* range);
    this.path.lineTo(120 + Math.sin(this.count) * range, 100 + Math.cos(this.count)* range);
    this.path.lineTo(-120 + Math.cos(this.count)* range, 100 + Math.sin(this.count)* range);
    this.path.lineTo(-120 + Math.sin(this.count) * range, -100 + Math.cos(this.count)* range);

    this.image.x = 150 + Math.cos( this.count ) * 100;
    this.image.y = 150 + Math.sin( this.count ) * 200;
    this.image.rotation -= 0.01;
    this.count += 0.05;
  }

  getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      console.log ( 'color' , color );
      return color;
  }

}
