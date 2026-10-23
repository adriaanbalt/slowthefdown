import { useFocusEffect } from "expo-router";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	PanResponder,
	StyleSheet,
	Text,
	View,
	type LayoutChangeEvent,
	type PanResponderInstance,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Vector2 } from "three";

import Colors from "@/constants/Colors";
import { formatFocusTime } from "@/game/format";
import { useUserStore } from "@/state/userStore";

import { createGameEngine, isInterruptedFrame, type GameEngine } from "./gameEngine";

const OFF_SCREEN = -10;

export default function HomeScreen() {
	const highscore = useUserStore((s) => s.highscore);
	const currentRun = useUserStore((s) => s.currentRun);
	const insets = useSafeAreaInsets();
	// Fresh native GL surface per mount (Fast Refresh won't call onContextCreate again otherwise).
	const [glViewKey] = useState(() => Date.now());

	const pointer = useRef(new Vector2(OFF_SCREEN, OFF_SCREEN));
	const size = useRef({ width: 1, height: 1 });
	const scoringRef = useRef(true);
	const engineRef = useRef<GameEngine | null>(null);
	const resetHoldRef = useRef<(() => void) | null>(null);

	useFocusEffect(
		useCallback(() => {
			scoringRef.current = true;
			return () => {
				scoringRef.current = false;
				pointer.current.set(OFF_SCREEN, OFF_SCREEN);
				resetHoldRef.current?.();
			};
		}, []),
	);

	const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
		engineRef.current?.dispose();
		const { setCurrentRun, recordRun } = useUserStore.getState();
		const engine = createGameEngine(gl, {
			pointer: pointer.current,
			scoring: () => scoringRef.current,
			onHoldTick: setCurrentRun,
			onHoldEnd: (tenths) => void recordRun(tenths),
		});
		engineRef.current = engine;
		resetHoldRef.current = () => engine.resetHold();
	}, []);

	useEffect(() => {
		let frameId = 0;
		let lastMs = Date.now();
		const tick = () => {
			frameId = requestAnimationFrame(tick);
			const engine = engineRef.current;
			if (!engine) return;
			const now = Date.now();
			const gapS = (now - lastMs) / 1000;
			lastMs = now;
			if (isInterruptedFrame(gapS)) engine.resetHold();
			engine.frame(gapS);
		};
		tick();
		return () => {
			cancelAnimationFrame(frameId);
			engineRef.current?.dispose();
			engineRef.current = null;
			resetHoldRef.current = null;
		};
	}, []);

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

	return (
		<View style={styles.container} onLayout={onLayout} {...panResponder.panHandlers}>
			<View style={[styles.hud, { top: Math.max(30, insets.top) }]} pointerEvents="none">
				<Text style={styles.hudText}>{formatFocusTime(highscore)}</Text>
				<Text style={styles.hudText}>{formatFocusTime(currentRun)}</Text>
			</View>
			<GLView key={glViewKey} style={styles.gl} onContextCreate={onContextCreate} msaaSamples={0} />
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
