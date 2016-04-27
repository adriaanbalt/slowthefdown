import PIXI from 'pixi.js';

export default class ScenePixi {

  constructor(){
    // Let pixi determine canvas or webGL renderer
    let renderer = new PIXI.autoDetectRenderer(800, 600);

    // add renderer canvas to the dom
    document.body.appendChild(renderer.view);

    // You need to create a root container that will hold the scene you want to draw.
    let stage = new PIXI.Container();

    // subscribe to resize events
    window.addEventListener( 'resize', () => this.onWindowResize(), false );

    this.updateEvent = new Event('update');
    this.renderer = renderer;
    this.stage = stage;
    this.onWindowResize();

    this.animate();
  }

  animate(){
    // dispatch update event
    window.dispatchEvent( this.updateEvent );

    // this is the main render call that makes pixi draw your container and its children.
    this.renderer.render( this.stage );

    // start the timer for the next animation loop
    requestAnimationFrame( this.animate.bind( this ) );
  }

  onWindowResize(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // update renderer
    this.renderer.resize( this.width, this.height );
  }

}
