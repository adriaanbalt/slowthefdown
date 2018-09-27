import Expo from "expo";
import React from "react";
import { Dimensions, View, Animated, PanResponder } from "react-native";
import ExpoTHREE, { THREE } from "expo-three"; // Version can be specified in package.json

import MeshContainer from "./MeshContainer";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      mouse: new THREE.Vector2(-1,1),
    };
    THREE.suppressExpoWarnings(true);
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener(value => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        });
        this.state.pan.setValue({ x: -1, y: -1 });
      },
      onPanResponderMove: ({ nativeEvent }, gestureState) => {
        if ( this.state.gl ) {
          this.state.mouse.x = (nativeEvent.locationX / this.state.gl.drawingBufferWidth) * 4 - 1;
          this.state.mouse.y = -(nativeEvent.locationY / this.state.gl.drawingBufferHeight) * 4 + 1;
        }
      },
    });

  }

  render() {
    return (
      <View
        {...this.panResponder.panHandlers}
        style={[
          {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }
        ]}
      >
        <Expo.GLView
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
      </View>
    );
  }

  _onGLContextCreate = async gl => {
    this.state.gl = gl;

    const scene = new THREE.Scene();

    const raycaster = new THREE.Raycaster(); // is this correct?

    const camera = new THREE.PerspectiveCamera(
      100,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      1,
      10000
      );
    camera.position.z = 2;
    
    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    
    let geometry = new THREE.PlaneGeometry(gl.drawingBufferWidth, gl.drawingBufferHeight);
    let material = new THREE.MeshBasicMaterial({
      color: 0x00FFFF,
    });
    let bg = new THREE.Mesh(geometry, material);
    scene.add(bg);

    geometry = new THREE.CircleGeometry(.5, 30);
    material = new THREE.MeshBasicMaterial({
        color: 0xFF00FF,
        opacity: 1
    });
    this.shape = new THREE.Mesh(geometry, material);
    scene.add(this.shape);
    
    let INTERSECTED;
      
    // raycaster.setFromCamera( this.state.mouse, camera );
    // let intersects = raycaster.intersectObjects(scene.children); // this doesn't seem to make any difference
    // console.log('intersects', scene.children, intersects.length)

    const animate = p => {
      requestAnimationFrame(animate);

      raycaster.setFromCamera( this.state.mouse, camera );
      // let intersects = raycaster.intersectObjects( objects );
      let intersects = raycaster.intersectObjects( scene.children ); // this doesn't seem to make any difference
      console.log(intersects.length, this.state.mouse);
      
      this.shape.position.x += .001;
      if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[ 0 ].object ) {
                INTERSECTED = intersects[ 0 ].object;
            }
        } else {
            INTERSECTED = null;
        }

      renderer.render(scene, camera);

      gl.endFrameEXP();
    };
    animate();
  };
}