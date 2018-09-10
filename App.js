import Expo from "expo";
import React from "react";
import Shader from "./Shaders/Shader";
import MovingLetter from "./Shaders/MovingLetter";
import { Dimensions, View, Animated, PanResponder } from "react-native";

// import * as THREE from "three";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      mouse: new THREE.Vector2(),
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
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: ({ nativeEvent }, gestureState) => {
        this.state.mouse.x = nativeEvent.locationX;
        this.state.mouse.y = nativeEvent.locationY;
        console.log("pandresponder move", this.state.mouse.x, this.state.mouse.y );
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
    const scene = new THREE.Scene();

    const light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      100,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );

    camera.position.z = 1000;

    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const texture = await ExpoTHREE.loadTextureAsync({
      asset: require("./img/stars.jpg")
    });
    const background = new Shader(texture);
    const backgroundMesh = background.getMesh();
    scene.add(backgroundMesh);

    const movingLetter = new MovingLetter();
    scene.add( movingLetter )

    camera.position.z = 2;

    const startTime = Date.now();

    const render = p => {
      requestAnimationFrame(render);

      const elapsedMilliseconds = Date.now() - startTime;
      const elapsedSeconds = elapsedMilliseconds / 1000.;

      background.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y );
      movingLetter.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y );

      camera.updateMatrixWorld();

      renderer.render(scene, camera);

      gl.endFrameEXP();
    };
    render();
  };
}
