'use strict';

import _ from 'lodash';
import PIXI from 'pixi.js';

export default class Kaleidoscope {
  
    constructor( scene, canvas, size ){
      this.HALF_PI = Math.PI / 2;
      this.QRTR_PI = Math.PI / 4;

      this.canvas = canvas;
      this.scene = scene;
      this.size = size;

      this.mirrorCount = 20;
      this.rotationFactor = 0;

      this.renderTexture = new PIXI.RenderTexture( this.scene.renderer, this.size, this.size );
      this.renderTexture.render( this.canvas );

      this.stage = new PIXI.Container();
      this.stage = this.stage;

      this.makeMirrors();

      this.stage.x = this.scene.renderer.width / 2;
      this.stage.y = this.scene.renderer.height / 2;
      // scene.stage.addChild( this.stage );

      window.addEventListener('update', () => this.draw() );
      window.addEventListener( 'resize', () => this.resize() );

      this.draw();
    }


    makeMirrors () {
      for ( let i = this.stage.children.length - 1; i >= 0; i--) {	
        this.stage.removeChild(this.stage.children[i]);
      }

      this.rotationFactor = ( Math.PI * 2.0 ) / ( this.mirrorCount * 2.0 );
      for( let i = 0; i < this.mirrorCount * 2; i+=2 ){
        _.times( 2, ( j ) => {
            let sprite = new PIXI.Sprite( this.renderTexture );
            sprite.pivot.x = this.size / 2;
            sprite.pivot.y = this.size;
            sprite.rotation = this.rotationFactor * (i + j);

            let spriteMask = this.makeMask();
            spriteMask.rotation = this.HALF_PI - (this.rotationFactor / 2) + (this.rotationFactor * (i+j) );
            spriteMask.alpha = 0.5;
            sprite.mask = spriteMask;

            let scale = (this.scene.renderer.height/1.0) / this.size;
            sprite.scale.y = sprite.scale.x = scale;
            sprite.scale.x *= (j == 0) ? 1 : -1;

            this.stage.addChild( sprite );
            this.stage.addChild( spriteMask );
        } );
      }
    }

    makeMask () {
      let maskSize = this.scene.renderer.height;
      let maskGraphic = new PIXI.Graphics();
      maskGraphic.beginFill( 0xff );
      maskGraphic.moveTo(0, 0);
      maskGraphic.lineTo( Math.cos(0) -maskSize, Math.sin(0) * -maskSize );
      maskGraphic.lineTo( Math.cos( this.rotationFactor) * -maskSize, Math.sin( this.rotationFactor) * -maskSize );
      maskGraphic.endFill();
      return maskGraphic;
    }

    setMirrors( count  ) {
      this.mirrorCount = count;
      this.makeMirrors();
    }

    draw () {
      this.renderTexture.clear();
      this.renderTexture.render( this.canvas );
    }

    resize () {
      this.stage.x = this.scene.renderer.width / 2;
      this.stage.y = this.scene.renderer.height / 2;
    }

}
