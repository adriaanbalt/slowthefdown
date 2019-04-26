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

import Vortex from "./Visualizations/Vortex";
import ObjectToCatch from "./ObjectToCatch";
import Particles from "./Visualizations/Particles";

import THREERoot from './ThreeRoot'

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
      mouse: new THREE.Vector2(-10, -10),
      deltaTime: 0,
      timescale: 60,
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
        this.state.pan.setValue({ x: -10, y: -10 })
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
        this.state.mouse.x = -10
        this.state.mouse.y = -10
      }
    })
  }

  navigateToHighscores = () => {
    this.props.navigation.navigate('Highscores', {})
  }

  createPieces = () => {
    
  }

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

    const texture = await ExpoTHREE.loadTextureAsync({
      asset: require("../../assets/images/stars.jpg")
    });
    const vortex = new Vortex(texture);
    const vortexMesh = vortex.getMesh();
    
    const objectToCatch = new ObjectToCatch();
    const objectToCatchMesh = objectToCatch.getMesh();
    
    // width, height, depth, prefabCount, prefabSize
    const particles = new Particles(40, 40, 40, 3000, 0.005, 0xFFFFFF);
    particles.setScale( 1000 ); // 100000
    const particlesMesh = particles.getMesh()
    
    const particlesGreen = new Particles(40, 40, 40, 3000, 0.005, 0x00FF00);
    particlesGreen.setScale(1000); // 100000
    const particlesGreenMesh = particlesGreen.getMesh()

    // vortexMesh.rotation.x = (0) * Math.PI / 180
    // vortexMesh.position.x = 0;
    // vortexMesh.position.y = -15;
    // vortexMesh.position.z = -20;
    // particlesMesh.position.z = 1;
    particlesMesh.position.y = -15;
    particlesGreenMesh.position.y = -15;

    // particlesGreenMesh.position.z = -21;
    
    camera.position.set(0, 0, 1.0).multiplyScalar(20);
    // scene.add(particlesMesh);
    scene.add(vortexMesh);
    scene.add(particlesGreenMesh);
    scene.add(objectToCatchMesh);

    const startTime = Date.now()
    let intersects
    this.startHowLongHeldMilliseconds = null
    this.elapsedHowLongHeldMilliseconds = null
    let elapsedSeconds
    let elapsedMilliseconds

    const updateParticlePositions = ( elapsedSeconds ) => {
      // slowly move the particles Z position forward, over time.
      // particlesGreenMesh.position.z += elapsedSeconds/this.state.timescale
      // particlesMesh.position.z += elapsedSeconds/this.state.timescale
      // console.log('particlesGreenMesh.position.z', particlesGreenMesh.position.z, this.state.timescale)
    }

    const over = () => {
      this.elapsedHowLongHeldMilliseconds = Date.now()
      let deltaTime = (this.elapsedHowLongHeldMilliseconds - this.startHowLongHeldMilliseconds)
      if (this.startHowLongHeldMilliseconds === null) {
        this.startHowLongHeldMilliseconds = Date.now()
      } else {
        this.setState({ deltaTime })
        // this.props.setDeltaTime( deltaTime )
      }
      particles.update(1/240)
      particles.setScale( 500 )

      particlesGreen.setScale( 500 )
      particlesGreen.update(1 / 240)
      objectToCatch.over( deltaTime )
      vortex.over( deltaTime, this.state.mouse )
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
      particles.setScale( 1000 )
      particles.update(1 / 60)
      particlesGreen.setScale( 1000 )
      particlesGreen.update(1 / 60)
      // speed up letter
      objectToCatch.out()
      // speed up vortex Vortex
      vortex.out()
    }

    const updateParticleRotation = ( rotation ) => {
      particlesMesh.rotation.x = (25 * this.state.mouse.y) * Math.PI / 180
    }

    const animate = p => {
      requestAnimationFrame(animate)

      elapsedMilliseconds = Date.now() - startTime
      elapsedSeconds = elapsedMilliseconds / 1000

      camera.updateMatrixWorld()
      
      objectToCatch.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y )
      vortex.update( elapsedSeconds, this.state.mouse.x, this.state.mouse.y, 0 )

      raycaster.setFromCamera( this.state.mouse, camera )
      intersects = raycaster.intersectObjects( scene.children, true )

      updateParticlePositions(elapsedSeconds)

      // adjusting perspective of particles to make it look like it moves versus the finger
      if ( this.state.mouse.y != -10 ) {
        particlesGreenMesh.rotation.y = (25 * this.state.mouse.x) * Math.PI / 180
      } else {
        particlesGreenMesh.rotation.x = (10) * Math.PI / 180
      }
      if ( this.state.mouse.x != -10 ) {
        // particlesGreenMesh.rotation.y = (25 * this.state.mouse.x) * Math.PI / 180
      } else {
        // particlesGreenMesh.rotation.y = (0) * Math.PI / 180
      }

      // console.log('this.state.mouse', this.state.mouse)

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
