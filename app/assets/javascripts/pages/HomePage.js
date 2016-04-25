'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import THREE from 'three';

import UI from '../lib/UI';
import Scene from '../components/Scene';
import Cube from '../components/Cube';
import API from '../redux/API';

class HomePage extends UI {

  componentWillMount( ){

    let s = new Scene();

    // create a dim ambient light
    let ambientLight = new THREE.AmbientLight( 0xFFFFFF );
    s.add( ambientLight );

    // and a brighter point light slightly off center
    let pointLight = new THREE.PointLight( 0xffffff );
    pointLight.position.set( -10, 50, 20 );
    s.add( pointLight );

    // define a standardized material for all Cubes to share
    let mat = new THREE.MeshPhongMaterial({
      color: this.getRandomColor()
      // map: THREE.ImageUtils.loadTexture('assets/textures/uv.jpg'),
      shininess: 1
    });
    let size = 10;
    let geo = new THREE.BoxGeometry( size, size, size );

    let f = new Cube( geo , mat );

    s.add( f );  

    console.log ( 'componentWillMount', f, s);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
