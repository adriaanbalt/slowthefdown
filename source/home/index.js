import './home.scss'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

import Config from 'components/Config.js';
import SpinSketch from 'components/SpinSketch.js';

import {
  setHighscore,
  setScore,
  setUserHighscore,
} from './reducer'

class Home extends Component {

  constructor(){
    super();
    console.log ( "home") 
    this.sketch = new SpinSketch( hs => this.overFn(hs), hs => this.outFn(hs) );
  }

  overFn( highscore ){
    this.props.setScore( highscore )
  }

  outFn( highscore ){
    this.props.setScore( highscore )
    if ( this.props.highscore.score < highscore ) {
      if ( this.props.user ) {
        console.log ( 'if there is a user set a highsore on the user in the DB' )
        // this.props.dispatch( API.setUserHighscore( highscore ) );
      } else {
        this.props.setHighscore( {score:highscore} )
      }
      // setTimeout( () => {
      //   this.props.hideDrawer()
      // }, 2000)
      // this.props.setHighscore( {highscore:highscore} )
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
}

const mapStateToProps = state => ({
  highscore: state.homeReducer.highscore,
  user: state.homeReducer.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setHighscore,
  setScore,
  setUserHighscore,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)