'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import UI from '../lib/UI';
import API from '../redux/API';
import ActionCreator from '../redux/ActionCreator';

import Config from '../components/Config.js';
// import SpinSketch from '../components/SpinSketch.js';
import HappyClouds from '../components/HappyClouds.js';

class HomePage extends UI {

  constructor(){
    super();
    this.sketch = new HappyClouds( hs => this.overFn(hs), hs => this.outFn(hs) );
  }

  overFn( highscore ){
    this.props.dispatch( ActionCreator.setScore( highscore ) );
  }

  outFn( highscore ){
    this.props.dispatch( ActionCreator.setScore( highscore ) );
    if ( this.props.highscore.score < highscore ) {
      if ( this.props.user ) {
        this.props.dispatch( API.setUserHighscore( highscore ) );
      } else {
        this.props.dispatch( ActionCreator.setHighscore( {score:highscore} ) );
      }
      // setTimeout( () => {
      //   this.props.dispatch( ActionCreator.hideDrawer() );
      // }, 2000)
      // this.props.dispatch( ActionCreator.setHighscore( {highscore:highscore} ) );
    }
  }

  reset(){
    this.sketch.reset();
  }

  componentDidMount(){
    this.sketch.start();
  }

  render () {
      return (
        <div id="container">
          <div id="game"></div>
        </div>
      )
  }

};

function mapStateToProps(store) {
  return {
    highscore: store.highscore,
    user: store.user
  };
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  highscore: PropTypes.object,
  user: PropTypes.object
};

export default connect(mapStateToProps)(HomePage);
