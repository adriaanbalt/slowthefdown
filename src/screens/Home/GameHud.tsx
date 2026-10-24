import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { formatStoredScore, formatTimerMs } from "@/game/format";
import type { GameMode } from "@/state/settingsStore";

import FocusBar from "./FocusBar";

export interface FocusHudState {
	focus: number;
	focusTimeMs: number;
	isDraining: boolean;
	phase: string;
}

interface Props {
	mode: GameMode;
	classicBestTenths: number;
	classicRunMs: number;
	focusBestTenths: number;
	focusHud: FocusHudState | null;
}

export default function GameHud({
	mode,
	classicBestTenths,
	classicRunMs,
	focusBestTenths,
	focusHud,
}: Props) {
	const insets = useSafeAreaInsets();

	if (mode === "classic") {
		return (
			<View style={[styles.hud, { top: Math.max(30, insets.top) }]} pointerEvents="none">
				<Text style={styles.hudText}>{formatStoredScore(classicBestTenths)}</Text>
				<Text style={styles.hudText}>{formatTimerMs(classicRunMs)}</Text>
			</View>
		);
	}

	const focus = focusHud?.focus ?? 1;
	const showBar = Boolean(focusHud && (focusHud.isDraining || focus < 0.999));
	const liveMs = focusHud ? Math.floor(focusHud.focusTimeMs) : 0;
	const best = formatStoredScore(focusBestTenths);
	const idle = !focusHud || focusHud.phase === "idle";

	return (
		<View style={[styles.hud, { top: Math.max(30, insets.top) }]} pointerEvents="none">
			{idle ? <Text style={styles.hudText}>{best}</Text> : null}
			<Text style={[styles.hudText, styles.faint]}>{formatTimerMs(liveMs)}</Text>
			<FocusBar focus={focus} visible={showBar} />
		</View>
	);
}

const styles = StyleSheet.create({
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
		fontVariant: ["tabular-nums"],
	},
	faint: {
		opacity: 0.35,
	},
});
