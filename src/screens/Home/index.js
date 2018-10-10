import Expo, { KeepAwake, FileSystem, Asset } from "expo";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
// import THREEJS from "three";
import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  TouchableOpacity
} from "react-native";

import Dispatchers from '../../redux/dispatchers';
import { isAuthenticated } from '../../redux/selectors';

import Waiting from '../../shared/Waiting';
import StyledButton from '../../shared/StyledButton';
import ShareTheNavigation from "../../shared/shareTheNavigation"

import Shader from "./components/Shader";
import MovingLetter from "./components/MovingLetter";
import SVGLoader from "./components/SVGLoader";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    // backgroundColor: 'white'
  },
});

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      fadeOutAnim: new Animated.Value(1),
      loading: true,
      pan: new Animated.ValueXY(),
      mouse: new THREE.Vector2(-1, -1),
      deltaTime: 0,
    };
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);

    ShareTheNavigation.set(props.navigation);
  }
  componentDidMount() {
    this.setState({ loading: true });
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

  navigateToHighscores = () => {
    this.props.navigation.navigate('Highscores', {});
  }

  loadFont = async () => {
    const font = require("../../assets/fonts/HelveticaNeueLT-Std_Bold");
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
      asset: require("../../assets/images/stars.jpg")
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

  renderGame() {
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
            backgroundColor: 'transparent'
          }}
          onPress={this.navigateToHighscores}>
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

  render() {
    const {
      errorMessage
    } = this.props;

    return this.renderGame();

    if (this.state.loading || errorMessage) {
      return (
        <Waiting loading={this.state.loading} errorMessage={errorMessage} />
      );
    }

  }

}

export default connect(state => ({
  isAuthenticated: isAuthenticated(state)
}), Dispatchers)(HomeScreen);
