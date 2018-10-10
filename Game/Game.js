import Expo from "expo";
import { FileSystem, Asset } from "expo";
import React from "react";
import {
  Dimensions,
  View,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity
} from "react-native";
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
      deltaTime: 0,
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
          let x = (nativeEvent.locationX / this.state.gl.drawingBufferWidth) * 6 - 1; // 6 for iOS xs & 4 for iOS 5SE
          let y = -(nativeEvent.locationY / this.state.gl.drawingBufferHeight) * 6 + 1;
          this.state.mouse.x = x
          this.state.mouse.y = y
        }
      },
      onPanResponderRelease: ({ nativeEvent }, gestureState) => {
        this.state.mouse.x = -1;
        this.state.mouse.y = -1;
      }
    });

  }

  gotoProfile() {
    console.log("gotoProfile");
  }

  render() {
    var { height, width } = Dimensions.get('window');
    return (
      <View
        {...this.panResponder.panHandlers}
        style={[
          {
            width,
            height,
          }
        ]}
      >
        <TouchableOpacity 
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: height - 60,
            left: 0,
            height: 30,
          }}
          onPress={this.gotoProfile}>
          <Text style={{
            color: '#fff',
            fontSize: 16,
            width,
            lineHeight: 30,
            textAlign: 'center'
          }}>{this.state.deltaTime}</Text>
        </TouchableOpacity>
        <Expo.GLView
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
      </View>
    );
  }

  loadFont = async () => {
    const font = require("./assets/fonts/HelveticaNeueLT-Std_Bold");
    return this.loadFontFromJson(font);
    // return this.loadFontFromUri(uri);
  };

  loadFontFromJson = json => new THREE.FontLoader().parse(json);

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
    renderer.setClearColor(0x000000, 1.0);

    const font = await this.loadFont();
    
    const texture = await ExpoTHREE.loadTextureAsync({
      asset: require("./img/stars.jpg")
    });
    const background = new Shader(texture);
    const backgroundMesh = background.getMesh();

    const movingLetter = new MovingLetter( font );
    const movingLetterMesh = movingLetter.getMesh();
    movingLetterMesh.position.z = 0;

    scene.add(backgroundMesh);
    scene.add(movingLetterMesh);

    camera.position.z = 2;

    const startTime = Date.now();
    let intersects;
    this.startHowLongHeldMilliseconds;
    this.elapsedHowLongHeldMilliseconds;
    let elapsedSeconds;
    let elapsedMilliseconds;
    
    const over = () => {
      let deltaTime = (this.elapsedHowLongHeldMilliseconds - this.startHowLongHeldMilliseconds);
      if (this.startHowLongHeldMilliseconds === null) {
        this.startHowLongHeldMilliseconds = Date.now()
      } else {
        this.setState({ deltaTime });
      }
      this.elapsedHowLongHeldMilliseconds = Date.now();
      movingLetter.over()
      background.over( deltaTime, this.state.mouse )
    }
    const out = () => {
      movingLetter.out();
      background.out()

      this.elapsedHowLongHeldMilliseconds = Date.now();
      let deltaTime = 0;
      this.startHowLongHeldMilliseconds = null;
    }

    const animate = p => {
      requestAnimationFrame(animate);

      elapsedMilliseconds = Date.now() - startTime;
      elapsedSeconds = elapsedMilliseconds / 1000;

      camera.updateMatrixWorld();
      
      movingLetter.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y );
      background.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y, 0 );
      
      raycaster.setFromCamera( this.state.mouse, camera );
      intersects = raycaster.intersectObjects( scene.children, true );
      
      if ( intersects.length > 1 ) {
        over()
      } else {
        out()
      }

      renderer.render(scene, camera);

      gl.endFrameEXP();
    };

    animate();
  }


}
