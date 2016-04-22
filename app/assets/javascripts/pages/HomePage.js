'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import ReactPIXI from 'react-pixi';
import PIXI from 'pixi.js';

import UI from '../lib/UI';
import Fsprite from '../components/Fsprite';
import API from '../redux/API';

class HomePage extends UI {

  constructor( props ) {
    super( props );
    // let Stage = React.createFactory(ReactPIXI.Stage);
    // let Sprite = React.createFactory(ReactPIXI.Sprite);
    // let DisplayObjectContainer = React.createFactory(ReactPIXI.DisplayObjectContainer);
    // let TilingSprite = React.createFactory(ReactPIXI.TilingSprite);
    // let VectorText = React.createFactory(ReactPIXI.Text);
    // let BitmapText = React.createFactory(ReactPIXI.BitmapText);

  }

  render () {
    let Stage = React.createFactory(ReactPIXI.Stage);
    let DisplayObjectContainer = React.createFactory(ReactPIXI.DisplayObjectContainer);
    console.log ( "Render HomePage" )
      return Stage(
        {width: window.innerWidth, height: window.innerHeight, backgroundcolor: 0xFFFFFF, interactive:true},
        // children components are the buttons and the dynamic sprites
        React.createElement(Fsprite, {key:'gui'}),
      );
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
