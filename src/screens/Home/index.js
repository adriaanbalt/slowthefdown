import Expo, { KeepAwake, FileSystem, Asset, GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three" // 3.0.0-alpha.4
// import THREEJS from "three"
import React from 'react'
import { connect } from 'react-redux'
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
} from "react-native"

import Dispatchers from '../../redux/dispatchers'
import { isAuthenticated, getCurrentUserHighscore, profile, getDeltaTime } from '../../redux/selectors'

import Waiting from '../../shared/Waiting'
import StyledButton from '../../shared/StyledButton'
import ShareTheNavigation from "../../shared/shareTheNavigation"
import NavigationUI from '../../shared/NavigationUI'

import Shader from "./components/Shader";
import MovingLetter from "./components/MovingLetter";
import Particles from "./components/Particles";

import THREERoot from './Root'

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    // backgroundColor: 'white'
  },
})

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

    this.state = {
      fadeOutAnim: new Animated.Value(1),
      loading: true,
      pan: new Animated.ValueXY(),
      mouse: new THREE.Vector2(-1, -1),
      deltaTime: 0,
    }
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true)

    ShareTheNavigation.set(props.navigation)
    // this.props.initialize()
  }
  componentDidMount() {
    this.setState({ loading: true })
    this.props
      .checkUserAccessToken()
      .then(user => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener(value => (this._val = value))

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        })
        this.state.pan.setValue({ x: -1, y: -1 })
      },
      onPanResponderMove: ({ nativeEvent }, gestureState) => {
        if ( this.state.gl ) {
          // ratio of mouse position to the width of the screen
          // todo something is wrong with the sizing
          this.state.mouse.x = (nativeEvent.locationX / width) * 2 - 1;
          this.state.mouse.y = -(nativeEvent.locationY / height) * 2 + 1;
        }
      },
      onPanResponderRelease: ({ nativeEvent }, gestureState) => {
        this.state.mouse.x = -1
        this.state.mouse.y = -1
      }
    })
  }

  navigateToHighscores = () => {
    this.props.navigation.navigate('Highscores', {})
  }

  loadFont = async () => {
    const font = require("../../assets/fonts/HelveticaNeueLT-Std_Bold.json");
    return this.loadFontFromJson(font)
  }
  loadFontFromJson = json => new THREE.FontLoader().parse(json)

  _onGLContextCreate = async gl => {
    console.log("_onGLContextCreate");
    this.state.gl = gl

    // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // gl.clearColor(0, 1, 1, 1);

    const renderer = new ExpoTHREE.Renderer({ gl, depth: false })
    renderer.setPixelRatio(window.pixelRatio || 1);
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    renderer.setClearColor(0x000000, 1.0)

    const camera = new THREE.PerspectiveCamera(
      100,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      20000
    );

    const scene = new THREE.Scene()
    
    const raycaster = new THREE.Raycaster()

    const font = await this.loadFont();

    const texture = await ExpoTHREE.loadTextureAsync({
      asset: require("../../assets/images/stars.jpg")
    });
    const background = new Shader(texture);
    const backgroundMesh = background.getMesh();
    const movingLetter = new MovingLetter(font);
    const movingLetterMesh = movingLetter.getMesh();
    
    // width, height, depth, prefabCount, prefabSize
    const particles = new Particles(20, 10, 40, 3000, 0.005);
    particles.setScale( 1000 ); // 100000
    const particlesMesh = particles.getMesh();

    camera.position.set(0, 0.1, 1.0).multiplyScalar(20);
    particlesMesh.rotation.x = 0 * Math.PI / 180

    // scene.add(backgroundMesh);
    scene.add(particlesMesh);
    scene.add(movingLetterMesh);

    const startTime = Date.now()
    let intersects
    this.startHowLongHeldMilliseconds = null
    this.elapsedHowLongHeldMilliseconds = null
    let elapsedSeconds
    let elapsedMilliseconds
    
    const over = () => {
      this.elapsedHowLongHeldMilliseconds = Date.now()
      let deltaTime = (this.elapsedHowLongHeldMilliseconds - this.startHowLongHeldMilliseconds)
      if (this.startHowLongHeldMilliseconds === null) {
        this.startHowLongHeldMilliseconds = Date.now()
      } else {
        this.setState({ deltaTime })
        // this.props.setDeltaTime( deltaTime )
      }
      movingLetter.over( deltaTime )
      background.over( deltaTime, this.state.mouse )
    }
    const out = () => {
      if ( this.startHowLongHeldMilliseconds !== null ) {
        this.elapsedHowLongHeldMilliseconds = Date.now()
        let deltaTime = (this.elapsedHowLongHeldMilliseconds - this.startHowLongHeldMilliseconds)
        // let deltaTime = 0
        this.startHowLongHeldMilliseconds = null
        // set highscore
        // this.props.setHighscore(deltaTime )
      }
      // speed up letter
      movingLetter.out()
      // speed up background shader
      background.out()
    }


    const animate = p => {
      requestAnimationFrame(animate)

      elapsedMilliseconds = Date.now() - startTime
      elapsedSeconds = elapsedMilliseconds / 1000

      camera.updateMatrixWorld()
      
      particles.update( 1/60 )
      movingLetter.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y )
      background.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y, 0 )

      raycaster.setFromCamera( this.state.mouse, camera )
      intersects = raycaster.intersectObjects( scene.children, true )


      // TODO: once particles are added, maybe intersects will change.
      if ( intersects.length > 0 ) {
        over()
      }
      else {
        out()
      }

      renderer.render(scene, camera)

      gl.endFrameEXP();
    }

    animate()
    this.setState({ loading: false })
  }
  navigateToHighscores = () => {
      this.props.navigation.navigate("Highscores", {});
  }
  navigateToProfile = () => {
      this.props.navigation.navigate("Profile", {});
  }
  renderGame() {
    const { height, width } = Dimensions.get('window')
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
        {
          this.state.loading
          &&
          <View style={{
            position: 'absolute',
            width,
            height,
            backgroundColor: '#000',
            zIndex: 10000,
          }}
          >
          <Text style={{
            color: '#fff',
            fontSize: 16,
            lineHeight: 30,
            top: '50%',
            width,
            textAlign: 'center'
          }}>Loading</Text>
          </View>
        }
        {
          !this.state.loading
          &&
          <TouchableOpacity 
            style={{
              position: 'absolute',
              zIndex: 1000,
              top: 30,
              left: 0,
              height: 30,
              backgroundColor: 'transparent'
            }}
            onPress={this.navigateToHighscores}>
            <Text style={{
              color: '#fff',
              fontSize: 16,
              lineHeight: 25,
              width,
              textAlign: 'center'
            }}>{this.props.currentUserHighscore}</Text>
            <Text style={{
              color: '#fff',
              fontSize: 16,
              lineHeight: 25,
              width,
              textAlign: 'center'
            }}>{this.state.deltaTime}</Text>
          </TouchableOpacity>
        }
        {
          !this.state.loading
          &&
          <NavigationUI navigation={this.props.navigation} />
        }
        <GLView
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
      </View>
    )
  }

  render() {
    const {
      errorMessage
    } = this.props

    return this.renderGame()

    if (this.state.loading || errorMessage) {
      return (
        <Waiting loading={this.state.loading} errorMessage={errorMessage} />
      )
    }

  }

}

export default connect(
  state => ({
    isAuthenticated: isAuthenticated(state),
    currentUserHighscore: getCurrentUserHighscore(state),
    deltaTime: getDeltaTime(state)
  }),
  Dispatchers
)(HomeScreen);
