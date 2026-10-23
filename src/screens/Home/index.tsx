import { useIsFocused } from "expo-router";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { useEffect, useRef } from "react";
import {
	PanResponder,
	StyleSheet,
	Text,
	View,
	type LayoutChangeEvent,
	type PanResponderInstance,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";

import Colors from "@/constants/Colors";
import { formatFocusTime } from "@/game/format";
import { createRenderer } from "@/gl/createRenderer";
import { useUserStore } from "@/state/userStore";

import ObjectToCatch from "./ObjectToCatch";
import Particles from "./Particles";

const OFF_SCREEN = -10;
const MAX_FRAME_S = 0.1;
const INTERRUPTED_S = 0.5;

export default function HomeScreen() {
	const highscore = useUserStore((s) => s.highscore);
	const currentRun = useUserStore((s) => s.currentRun);
	const isFocused = useIsFocused();
	const insets = useSafeAreaInsets();

	const pointer = useRef(new Vector2(OFF_SCREEN, OFF_SCREEN));
	const size = useRef({ width: 1, height: 1 });
	const focusedRef = useRef(isFocused);
	const stopRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		focusedRef.current = isFocused;
		if (!isFocused) pointer.current.set(OFF_SCREEN, OFF_SCREEN);
	}, [isFocused]);

	useEffect(() => () => stopRef.current?.(), []);

	const panResponderRef = useRef<PanResponderInstance | null>(null);
	panResponderRef.current ??= PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderGrant: ({ nativeEvent }) => setPointer(nativeEvent.locationX, nativeEvent.locationY),
		onPanResponderMove: ({ nativeEvent }) => setPointer(nativeEvent.locationX, nativeEvent.locationY),
		onPanResponderRelease: () => pointer.current.set(OFF_SCREEN, OFF_SCREEN),
		onPanResponderTerminate: () => pointer.current.set(OFF_SCREEN, OFF_SCREEN),
	});
	const panResponder = panResponderRef.current;

	function setPointer(x: number, y: number) {
		const { width, height } = size.current;
		pointer.current.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
	}

	function onLayout(e: LayoutChangeEvent) {
		const { width, height } = e.nativeEvent.layout;
		size.current = { width, height };
	}

	function onContextCreate(gl: ExpoWebGLRenderingContext) {
		const renderer = createRenderer(gl);
		const camera = new PerspectiveCamera(100, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 20000);
		camera.position.set(0, 0, 20);
		const scene = new Scene();
		const raycaster = new Raycaster();

		const particles = new Particles({
			width: 40,
			height: 40,
			depth: 40,
			count: 3000,
			size: 0.005,
			color: 0xffffff,
			scale: 1000,
		});
		particles.mesh.position.y = -15;
		const target = new ObjectToCatch();
		scene.add(particles.mesh, target.mesh);

		const { setCurrentRun, recordRun } = useUserStore.getState();
		let heldSinceMs = 0;
		let lastMs = performance.now();
		let frameId = 0;

		const heldTenths = (now: number) => Math.ceil((now - heldSinceMs) / 100);

		const frame = () => {
			frameId = requestAnimationFrame(frame);
			const now = performance.now();
			const gapS = (now - lastMs) / 1000;
			const dt = Math.min(gapS, MAX_FRAME_S);
			lastMs = now;
			// A hold interrupted by a tab switch or the app backgrounding doesn't count.
			if (!focusedRef.current || gapS > INTERRUPTED_S) heldSinceMs = 0;
			if (!focusedRef.current) return;
			const frames = dt * 60;

			target.update(frames);
			camera.updateMatrixWorld();
			raycaster.setFromCamera(pointer.current, camera);
			const over = raycaster.intersectObjects(target.hitTargets, false).length > 0;

			if (over) {
				if (heldSinceMs === 0) heldSinceMs = Date.now();
				else setCurrentRun(heldTenths(Date.now()));
				particles.advance(frames / 240);
				target.over();
			} else {
				if (heldSinceMs !== 0) {
					void recordRun(heldTenths(Date.now()));
					heldSinceMs = 0;
				}
				particles.advance(frames / 60);
				target.out();
			}

			renderer.render(scene, camera);
			gl.endFrameEXP();
		};
		frame();

		stopRef.current = () => {
			cancelAnimationFrame(frameId);
			target.dispose();
			particles.dispose();
			renderer.dispose();
		};
	}

	return (
		<View style={styles.container} onLayout={onLayout} {...panResponder.panHandlers}>
			<View style={[styles.hud, { top: Math.max(30, insets.top) }]} pointerEvents="none">
				<Text style={styles.hudText}>{formatFocusTime(highscore)}</Text>
				<Text style={styles.hudText}>{formatFocusTime(currentRun)}</Text>
			</View>
			<GLView style={styles.gl} onContextCreate={onContextCreate} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	gl: {
		flex: 1,
	},
	hud: {
		position: "absolute",
		zIndex: 1000,
		left: 0,
		width: "100%",
		alignItems: "center",
	},
	hudText: {
		color: "#fff",
		fontSize: 16,
		lineHeight: 25,
		width: "100%",
		textAlign: "center",
	},
});
