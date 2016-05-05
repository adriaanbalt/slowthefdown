'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import UI from '../lib/UI';
import API from '../redux/API';
// import ScenePixi from '../components/ScenePixi.js';
// import Texture from '../components/Texture.js';
// import Kaleidoscope from '../components/Kaleidoscope.js';
// import Ftext from '../components/Ftext.js';

import SpinSketch from '../components/SpinSketch.js';

class HomePage extends UI {

  constructor ( ){
    super();
    this.scene = new SpinSketch();
    // this.renderSize = 800;
    // this.textCanvas = new PIXI.Container();
    // this.canvas = new PIXI.Container();

    // this.highscoreText = new PIXI.Text(
    //   'Highscore:', 
    //   { 
    //     font : '50px Arial', 
    //     fill : 0xFFFFFF
    //   }
    // );

    // this.textCanvas.addChild( this.highscoreText );

    // this.texture = new Texture( this.scene, this.canvas, this.renderSize )
    // this.kaleido = new Kaleidoscope( this.scene, this.canvas, this.renderSize );
    // this.Ftext = new Ftext( this.scene, this.renderSize, this.overFn, (hs) => this.outFn(hs) );
    // // this.scene.stage.addChild( this.texture.stage );
    // this.scene.stage.addChild( this.textCanvas );
    // this.scene.stage.addChild( this.Ftext.stage );
    // // this.scene.stage.addChild( this.kaleido.stage );
  }

  overFn(){
    console.log ( "over!" );
  }
  outFn( highscore ){
    console.log ( 'outFn highscore', highscore );
    this.highscoreText.text = `Highscore: ${highscore} seconds`;
  }

  render () {
    console.log ( 'HomePage' );
      return (<div></div>)
  }

};

function mapStateToProps(store) {
  return {
  };
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(HomePage);
