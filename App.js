import Expo from "expo";
import React from "react";
import Shader from "./Shaders/Shader";
import MovingLetter from "./Shaders/MovingLetter";
import { Dimensions, View, Animated, PanResponder } from "react-native";

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
        this.state.mouse.x = -1;
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

    const light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      100,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      1,
      10000
    );

    // const camera = new THREE.OrthographicCamera(
    //   gl.drawingBufferWidth / - 2,
    //   gl.drawingBufferWidth / 2,
    //   gl.drawingBufferHeight / 2,
    //   gl.drawingBufferHeight / - 2,
    //   0.1,
    //   1000
    // );

    // const frustum = gl.drawingBufferHeight;
    // var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;

    // const camera = new THREE.OrthographicCamera(
    //   frustum * aspect / - 2,
    //   frustum * aspect / 2,
    //   frustum / 2,
    //   frustum / - 2,
    //   1,
    //   1000
    // );

    // camera.position.z = 1000;

    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const texture = await ExpoTHREE.loadTextureAsync({
      asset: require("./img/stars.jpg")
    });
    const background = new Shader(texture);
    const backgroundMesh = background.getMesh();
    scene.add(backgroundMesh);

    const movingLetter = new MovingLetter();
    const movineLetterMesh = movingLetter.getMesh();
    scene.add(movineLetterMesh);

    let objects = []
    objects.push(movineLetterMesh);

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
      let intersects = raycaster.intersectObjects( objects );
      
      // let mesh = intersects.filter(obj => { 
      //   // console.log( 'obj', obj )
      //   return obj.object.superName != 'SpinShader' 
      // });

      if ( intersects.length > 0 ) {
        movingLetter.over()
        // console.log('intersects', intersects[0])
        if ( INTERSECTED != intersects[ 0 ].object ) {
          // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
          // console.log("INTERSECTED", INTERSECTED);
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
