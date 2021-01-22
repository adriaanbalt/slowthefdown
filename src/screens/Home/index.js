import Expo from "expo";
import { GLView } from "expo-gl";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
// import THREEJS from "three"
import React from "react";
import { connect } from "react-redux";
import {
	StyleSheet,
	View,
	Animated,
	Text,
	Dimensions,
	PanResponder,
	TouchableOpacity,
} from "react-native";

import Dispatchers from "../../redux/dispatchers";
import {
	isAuthenticated,
	getCurrentUserHighscore,
	getDeltaTime,
	getLevels,
} from "../../redux/selectors";

import InterstitialAd from "../../shared/InterstitialAd";
import ShareTheNavigation from "../../shared/shareTheNavigation";

import ObjectToCatch from "./ObjectToCatch";

import ParticlesLevel from "./levels/ParticlesLevel";

import Colors from "../../constants/Colors";

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		width,
		height: "100%",
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
			pan: new Animated.ValueXY(),
			mouse: new THREE.Vector2(-10, -10),
			deltaTime: 0,
			timescale: 60,
		};
		// Turn off extra warnings
		THREE.suppressExpoWarnings(true);

		ShareTheNavigation.set(props.navigation);
		this.props.initialize();
	}

	componentDidMount() {
		this._val = { x: 0, y: 0 };
		this.state.pan.addListener((value) => (this._val = value));
	}

	_panResponder = PanResponder.create({
		onStartShouldSetPanResponder: (e, gesture) => true,
		onPanResponderGrant: (e, gesture) => {
			this.state.pan.setOffset({
				x: this._val.x,
				y: this._val.y,
			});
			this.state.pan.setValue({ x: -10, y: -10 });
		},
		onPanResponderMove: ({ nativeEvent }, gestureState) => {
			if (this.state.gl) {
				// ratio of mouse position to the width of the screen
				// todo something is wrong with the sizing
				this.state.mouse.x = (nativeEvent.locationX / width) * 2 - 1;
				this.state.mouse.y = -(nativeEvent.locationY / height) * 2 + 1;
			}
		},
		onPanResponderRelease: ({ nativeEvent }, gestureState) => {
			this.state.mouse.x = -10;
			this.state.mouse.y = -10;
		},
	});

	createLevels = () => {
		this.currentLevel = new ParticlesLevel({});
		// for (let i = 0; i < this.props.levels.length; i++) {
		// how can we dynamically create the levels?
		// based on the level, we need to set the correct level as the current level
		// is this a big ass switch statement in a while loop?
		// or is it a recursive function? where the accumulator is the level the user is on?
		// when a level is complete, you need to update the current level
		// once u update the current level it needs to call it's update function()
		// how do you know that the level is complete?
		// }
	};

	addLevelToScene = (level) => {
		this.scene.add(level.getMesh());
	};

	showLevelComplete = (level) => {};

	_onGLContextCreate = async (gl) => {
		this.state.gl = gl;

		this.createLevels();
		// gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		// gl.clearColor(0, 1, 1, 1);

		const renderer = new ExpoTHREE.Renderer({ gl, depth: false });
		renderer.setPixelRatio(window.pixelRatio || 1);
		renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
		renderer.setClearColor(0x000000, 1.0);
		const camera = new THREE.PerspectiveCamera(
			100,
			gl.drawingBufferWidth / gl.drawingBufferHeight,
			0.1,
			20000,
		);
		this.scene = new THREE.Scene();
		const raycaster = new THREE.Raycaster();

		const objectToCatch = new ObjectToCatch();
		const objectToCatchMesh = objectToCatch.getMesh();

		camera.position.set(0, 0, 1.0).multiplyScalar(20);
		this.addLevelToScene(this.currentLevel);
		this.scene.add(objectToCatchMesh);

		const startTime = Date.now();
		let intersects;
		this.startHowLongHeldMilliseconds = 0;
		this.elapsedHowLongHeldMilliseconds = 0;
		let elapsedSeconds;
		let elapsedMilliseconds;

		const over = () => {
			this.elapsedHowLongHeldMilliseconds = Date.now();

			let deltaTime = Math.ceil(
				(this.elapsedHowLongHeldMilliseconds -
					this.startHowLongHeldMilliseconds) /
					100,
			);
			if (this.startHowLongHeldMilliseconds === 0) {
				this.startHowLongHeldMilliseconds = Date.now();
			} else {
				this.props.setDeltaTime(deltaTime);
			}

			if (this.currentLevel) this.currentLevel.over();
			objectToCatch.over(deltaTime);
		};
		const out = () => {
			if (this.startHowLongHeldMilliseconds !== 0) {
				this.elapsedHowLongHeldMilliseconds = Date.now();
				let deltaTime = Math.ceil(
					(this.elapsedHowLongHeldMilliseconds -
						this.startHowLongHeldMilliseconds) /
						100,
				);
				// let deltaTime = 0
				this.startHowLongHeldMilliseconds = 0;
				// set highscore on server
				this.props.setHighscore(deltaTime);
				// this.props.showInterstitial();
			}
			if (this.currentLevel) this.currentLevel.out();
			objectToCatch.out();
		};

		const updateParticleRotation = (rotation) => {
			particlesMesh.rotation.x =
				(25 * this.state.mouse.y * Math.PI) / 180;
		};

		const animate = (p) => {
			requestAnimationFrame(animate);

			elapsedMilliseconds = Date.now() - startTime;
			elapsedSeconds = elapsedMilliseconds / 1000;

			camera.updateMatrixWorld();

			// in here is all of the level controls
			// if (
			// 	this.currentLevel.duration >= elapsedMilliseconds &&
			// 	this.currentLevel
			// ) {
			// 	this.showLevelComplete();
			// }

			objectToCatch.update(
				elapsedSeconds,
				this.state.mouse.x,
				this.state.mouse.y,
			);

			raycaster.setFromCamera(this.state.mouse, camera);
			intersects = raycaster.intersectObjects(this.scene.children, true);

			// the particle center will follow the object that is moving
			// const objectPosX = objectToCatchMesh.position.x / 10;
			// const objectPosY = objectToCatchMesh.position.y / 10;
			// particlesGreenMesh.rotation.y = (25 * objectPosX * Math.PI) / 180;
			// particlesGreenMesh.rotation.x = -(25 * objectPosY * Math.PI) / 180;

			// adjusting perspective of particles to make it look like it moves versus the finger
			if (this.currentLevel)
				this.currentLevel.mouseAdjust(this.state.mouse);

			if (intersects.length > 0) {
				over();
			} else {
				out();
			}

			renderer.render(this.scene, camera);

			gl.endFrameEXP();
		};

		animate();
	};

	renderGame() {
		return (
			<View {...this._panResponder.panHandlers} style={styles.container}>
				<TouchableOpacity
					style={{
						position: "absolute",
						zIndex: 1000,
						top: 30,
						left: 0,
						height: 30,
						backgroundColor: "transparent",
					}}>
					<Text
						style={{
							color: "#fff",
							fontSize: 16,
							lineHeight: 25,
							width,
							textAlign: "center",
						}}>
						{this.props.highscore}
					</Text>
					<Text
						style={{
							color: "#fff",
							fontSize: 16,
							lineHeight: 25,
							width,
							textAlign: "center",
						}}>
						{this.props.deltaTime}
					</Text>
				</TouchableOpacity>
				<GLView
					style={{ flex: 1 }}
					onContextCreate={this._onGLContextCreate}
				/>
				<InterstitialAd />
			</View>
		);
	}

	render() {
		return this.renderGame();
	}
}

export default connect(
	(state) => ({
		isAuthenticated: isAuthenticated(state),
		highscore: getCurrentUserHighscore(state),
		deltaTime: getDeltaTime(state),
		levels: getLevels(state),
	}),
	Dispatchers,
)(HomeScreen);
