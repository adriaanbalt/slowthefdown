import Expo from "expo";
import { FileSystem, Asset } from "expo";
import React from "react";
import { Dimensions, View, Animated, PanResponder } from "react-native";
import Shader from "./Shaders/Shader";
import MovingLetter from "./Shaders/MovingLetter";
import SVGLoader from "./lib/SVGLoader";

// import THREEJS from "three";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      mouse: new THREE.Vector2(-1, -1),
    };
    // Turn off extra warnings
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
      onPanResponderRelease: ({ nativeEvent }, gestureState) => {
        this.state.mouse.x = -1;
        this.state.mouse.y = -1;
      }
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
    
    const raycaster = new THREE.Raycaster();
    
    const light = new THREE.PointLight(0xFFFFFF, 1, -1);
    light.position.set(0, 50, 50);
    scene.add(light);
    
    const camera = new THREE.PerspectiveCamera(
      100,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      1,
      10000
    );
    camera.position.z = 2;
    
    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    // renderer.setClearColor(0x000000, 1.0);

    const texture = await ExpoTHREE.loadTextureAsync({
      asset: require("./img/stars.jpg")
    });
    const background = new Shader(texture);
    const backgroundMesh = background.getMesh();
    
    const movingLetter = new MovingLetter();
    const movingLetterMesh = movingLetter.getMesh();
    movingLetterMesh.position.z = 0;
    
    scene.add(backgroundMesh);
    scene.add(movingLetterMesh);

    camera.position.z = 2;

    const startTime = Date.now();
    let INTERSECTED;

    const animate = p => {
      requestAnimationFrame(animate);

      const elapsedMilliseconds = Date.now() - startTime;
      const elapsedSeconds = elapsedMilliseconds / 1000;

      camera.updateMatrixWorld();

      background.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y );
      movingLetter.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y );
      raycaster.setFromCamera( this.state.mouse, camera );
      let intersects = raycaster.intersectObjects( scene.children, true );

      if ( intersects.length > 1 ) {
        movingLetter.over()
        if ( INTERSECTED != intersects[ 0 ].object ) {
          // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
          INTERSECTED = intersects[ 0 ].object;
          // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          // INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
      } else {
        movingLetter.out();
        // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
      }

      renderer.render(scene, camera);

      gl.endFrameEXP();
    };
    animate();
  };
}
