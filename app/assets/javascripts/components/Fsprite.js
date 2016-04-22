'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import ReactPIXI from 'react-pixi';
import PIXI from 'pixi.js';

import UI from '../lib/UI';
import ActionCreator from '../redux/ActionCreator';

var DisplayObjectContainer = React.createFactory(ReactPIXI.DisplayObjectContainer);
var VectorText = React.createFactory(ReactPIXI.Text);

class Fsprite extends UI {

  componentDidMount() {
    let newrotation;
    let animationcallback = (e) => {
      newrotation = this.props.rotation + (this.props.speed * 0.016);// use timestamp passed in!!!
      this.props.dispatch( ActionCreator.updateAnimation({
          rotation: newrotation,
          callback: requestAnimationFrame(animationcallback)
        }));
    };

    // add an interval timer function to rotate the camera
    this.props.dispatch( ActionCreator.updateAnimation({
      callback: requestAnimationFrame(animationcallback)
    }));
  }

  componentWillUnmount() {
    if (this.props.callback !== null) {
      cancelAnimationFrame(this.props.callback);
    }
  }

  render () {
    var spinatprops = {x:this.props.x, y:this.props.y, rotation:this.props.rotation};

    // the first DisplayObjectContainer offsets everything so we need to wrap another
    // DoC to move everythiing back into place
    var restoreoffsetprops = {x:-this.props.x, y:-this.props.y};

    // console.log ( "Fsprire render", this.props, spinatprops, restoreoffsetprops);

    return DisplayObjectContainer(spinatprops, 
            DisplayObjectContainer(restoreoffsetprops, 
              DisplayObjectContainer(
                {},
                VectorText({x:10,y:10, key:'label1', text:'HELP', style:{font:'25px Times'}}) 
              )
            )
          );
  }

};

function mapStateToProps(store) {
  return {
    x: store.animation.x,
    y: store.animation.y,
    speed: store.animation.speed,
    rotation: store.animation.rotation
  };
}

Fsprite.propTypes = {
  dispatch: PropTypes.func.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  speed: PropTypes.number,
  rotation: PropTypes.number
};

export default connect(mapStateToProps)(Fsprite);
