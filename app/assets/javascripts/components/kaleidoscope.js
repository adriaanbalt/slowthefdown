import _ from 'underscore';
import PIXI from 'pixi.js';

export default class Kaleidoscope extends {
  
    constructor( pixiScene, this.container, renderSize ){
      var HALF_PI = Math.PI / 2;
      var QRTR_PI = Math.PI / 4;

      renderTexture: null,
      kaleidoStage: null,
      mirrorCount: 3,
      rotationFactor: 0,
      active: true,

      this.renderTexture = new PIXI.RenderTexture( pixiScene.renderer, renderSize, renderSize );
      this.renderTexture.render( this.container );
      this.kaleidoStage = new PIXI.Container();
      var kaleidoStage = this.kaleidoStage;

      this.makeMirrors();

      kaleidoStage.x = pixiScene.renderer.width / 2;
      kaleidoStage.y = pixiScene.renderer.height / 2;
      // pixiScene.stage.addChild( kaleidoStage );

      _.bindAll( this, 'draw'  );
      _.bindAll( this, 'resize' );
      window.addEventListener('update', this.draw );
      window.addEventListener( 'resize', this.resize );

      this.draw();
    }

    makeMirrors () {
      var kaleidoStage = this.kaleidoStage;
      for (var i = kaleidoStage.children.length - 1; i >= 0; i--) {	kaleidoStage.removeChild(kaleidoStage.children[i]);};
      this.rotationFactor = ( Math.PI * 2.0 ) / ( this.mirrorCount * 2.0 );
      for( var i = 0; i < this.mirrorCount * 2; i+=2 ){
        _.times( 2, function( j ){
            var sprite = new PIXI.Sprite( this.renderTexture );
            sprite.pivot.x = renderSize / 2;
            sprite.pivot.y = renderSize;
            sprite.rotation = this.rotationFactor * (i + j);

            var spriteMask = this.makeMask();
            spriteMask.rotation = HALF_PI - (this.rotationFactor / 2) + (this.rotationFactor * (i+j) );
            spriteMask.alpha = 0.5;
            sprite.mask = spriteMask;

            var scale = (pixiScene.renderer.height/1.0) / renderSize;
            sprite.scale.y = sprite.scale.x = scale;
            sprite.scale.x *= (j == 0) ? 1 : -1;

            kaleidoStage.addChild( sprite );
            kaleidoStage.addChild( spriteMask );
        } this );
      }
    }

    makeMask () {
      var maskSize = pixiScene.renderer.height;
      var maskGraphic = new PIXI.Graphics();
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
      this.renderTexture.render( this.container );
    }

    resize () {
      this.kaleidoStage.x = pixiScene.renderer.width / 2;
      this.kaleidoStage.y = pixiScene.renderer.height / 2;
    }

}
