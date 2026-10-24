import { useFocusEffect } from "expo-router";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	PanResponder,
	StyleSheet,
	View,
	type LayoutChangeEvent,
	type PanResponderInstance,
} from "react-native";
import { Vector2 } from "three";

import Colors from "@/constants/Colors";
import type { RunSnapshot } from "@/game/RunController";
import { recordRunTelemetry } from "@/game/telemetry";
import { useSettingsStore } from "@/state/settingsStore";
import { useUserStore } from "@/state/userStore";

import DebugPanel from "./DebugPanel";
import GameHud, { type FocusHudState } from "./GameHud";
import { createGameEngine, isInterruptedFrame, type GameEngine } from "./gameEngine";
import RunSummary, { type RunSummaryData } from "./RunSummary";

const OFF_SCREEN = -10;
const HUD_INTERVAL_MS = 100;

export default function HomeScreen() {
	const highscore = useUserStore((s) => s.highscore);
	const focusHighscore = useUserStore((s) => s.focusHighscore);
	const currentRun = useUserStore((s) => s.currentRun);
	const sessionMode = useSettingsStore((s) => s.sessionMode);
	const [glViewKey] = useState(() => Date.now());
	const [focusHud, setFocusHud] = useState<FocusHudState | null>(null);
	const [summary, setSummary] = useState<RunSummaryData | null>(null);
	const [debugOpen, setDebugOpen] = useState(false);

	const pointer = useRef(new Vector2(OFF_SCREEN, OFF_SCREEN));
	const size = useRef({ width: 1, height: 1 });
	const touchingRef = useRef(false);
	const scoringRef = useRef(true);
	const engineRef = useRef<GameEngine | null>(null);
	const modeRef = useRef(sessionMode);
	const lastHudMs = useRef(0);
	const fingerCount = useRef(0);
	const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	modeRef.current = sessionMode;

	useEffect(() => {
		engineRef.current?.resetRun();
		setFocusHud(null);
		setSummary(null);
		useUserStore.getState().setCurrentRun(0);
	}, [sessionMode]);

	useFocusEffect(
		useCallback(() => {
			scoringRef.current = true;
			return () => {
				scoringRef.current = false;
				touchingRef.current = false;
				pointer.current.set(OFF_SCREEN, OFF_SCREEN);
				engineRef.current?.resetRun();
			};
		}, []),
	);

	const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
		engineRef.current?.dispose();
		const { setCurrentRun, recordRun, recordFocusScore } = useUserStore.getState();
		const engine = createGameEngine(gl, {
			pointer: pointer.current,
			touching: () => touchingRef.current,
			mode: () => modeRef.current,
			scoring: () => scoringRef.current,
			onHoldTick: setCurrentRun,
			onHoldEnd: (ms) => void recordRun(ms),
			onFocusHud: (snap: RunSnapshot) => {
				const now = Date.now();
				if (now - lastHudMs.current < HUD_INTERVAL_MS) return;
				lastHudMs.current = now;
				setFocusHud({
					focus: snap.focus,
					focusTimeMs: snap.focusTime * 1000,
					isDraining: snap.isDraining,
					phase: snap.phase,
				});
			},
			onFocusRunEnd: (snap: RunSnapshot) => {
				void recordFocusScore(snap.scoreTenths);
				void recordRunTelemetry({
					focusTenths: snap.scoreTenths,
					runTimeS: snap.runTime,
					recoveries: snap.recoveries,
					difficulty: snap.difficulty,
				});
				setSummary({
					focusTenths: snap.scoreTenths,
					runTimeS: snap.runTime,
					recoveries: snap.recoveries,
					bestTenths: Math.max(useUserStore.getState().focusHighscore, snap.scoreTenths),
				});
			},
		});
		engineRef.current = engine;
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
			if (isInterruptedFrame(gapS)) engine.resetRun();
			engine.frame(gapS);
		};
		tick();
		return () => {
			cancelAnimationFrame(frameId);
			engineRef.current?.dispose();
			engineRef.current = null;
		};
	}, []);

	function clearLongPress() {
		if (longPressTimer.current) {
			clearTimeout(longPressTimer.current);
			longPressTimer.current = null;
		}
	}

	const panResponderRef = useRef<PanResponderInstance | null>(null);
	panResponderRef.current ??= PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderGrant: ({ nativeEvent }) => {
			fingerCount.current = nativeEvent.touches?.length ?? 1;
			touchingRef.current = true;
			setPointer(nativeEvent.locationX, nativeEvent.locationY);
			clearLongPress();
			if (fingerCount.current >= 3) {
				longPressTimer.current = setTimeout(() => setDebugOpen(true), 600);
			}
		},
		onPanResponderMove: ({ nativeEvent }) => {
			fingerCount.current = nativeEvent.touches?.length ?? 1;
			setPointer(nativeEvent.locationX, nativeEvent.locationY);
			if (fingerCount.current < 3) clearLongPress();
		},
		onPanResponderRelease: () => {
			clearLongPress();
			fingerCount.current = 0;
			touchingRef.current = false;
			pointer.current.set(OFF_SCREEN, OFF_SCREEN);
		},
		onPanResponderTerminate: () => {
			clearLongPress();
			fingerCount.current = 0;
			touchingRef.current = false;
			pointer.current.set(OFF_SCREEN, OFF_SCREEN);
		},
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
			<GameHud
				mode={sessionMode}
				classicBestTenths={highscore}
				classicRunMs={currentRun}
				focusBestTenths={focusHighscore}
				focusHud={focusHud}
			/>
			<GLView key={glViewKey} style={styles.gl} onContextCreate={onContextCreate} msaaSamples={0} />
			{summary && sessionMode === "focus" ? (
				<RunSummary
					data={summary}
					onDismiss={() => {
						setSummary(null);
						engineRef.current?.resetRun();
						setFocusHud(null);
					}}
				/>
			) : null}
			{debugOpen ? <DebugPanel onClose={() => setDebugOpen(false)} /> : null}
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
});
