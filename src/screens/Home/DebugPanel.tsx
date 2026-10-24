import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import ModeToggle from "@/components/ModeToggle";
import Colors from "@/constants/Colors";
import { cloneTuning, resetTuning, tuning } from "@/game/constants";
import { readTelemetry, summarizeTelemetry } from "@/game/telemetry";
import { useSettingsStore } from "@/state/settingsStore";

interface Props {
	onClose: () => void;
}

function SliderRow({
	label,
	value,
	min,
	max,
	step,
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (v: number) => void;
}) {
	return (
		<View style={styles.sliderBlock}>
			<Text style={styles.sliderLabel}>
				{label}: {value.toFixed(2)}
			</Text>
			<Slider
				minimumValue={min}
				maximumValue={max}
				step={step}
				value={value}
				onValueChange={onChange}
				minimumTrackTintColor={Colors.fontColor}
				maximumTrackTintColor={Colors.grayColor}
			/>
		</View>
	);
}

export default function DebugPanel({ onClose }: Props) {
	const sessionMode = useSettingsStore((s) => s.sessionMode);
	const setSessionMode = useSettingsStore((s) => s.setSessionMode);
	const [, bump] = useState(0);
	const [summary, setSummary] = useState("…");

	useEffect(() => {
		void readTelemetry().then((runs) => setSummary(summarizeTelemetry(runs)));
	}, []);

	function refresh() {
		bump((n) => n + 1);
	}

	return (
		<View style={styles.overlay}>
			<ScrollView contentContainerStyle={styles.card}>
				<Text style={styles.title}>Debug</Text>
				<ModeToggle label="Play mode now" value={sessionMode} onChange={setSessionMode} />
				<Text style={styles.meta}>{summary}</Text>

				<SliderRow
					label="T (difficulty scale)"
					value={tuning.timeScaleS}
					min={100}
					max={600}
					step={10}
					onChange={(v) => {
						tuning.timeScaleS = v;
						refresh();
					}}
				/>
				<SliderRow
					label="Grace (s)"
					value={tuning.graceS}
					min={0}
					max={1}
					step={0.05}
					onChange={(v) => {
						tuning.graceS = v;
						refresh();
					}}
				/>
				<SliderRow
					label="Drain start %/s"
					value={tuning.drainStart}
					min={10}
					max={60}
					step={1}
					onChange={(v) => {
						tuning.drainStart = v;
						refresh();
					}}
				/>
				<SliderRow
					label="Drain max %/s"
					value={tuning.drainMax}
					min={40}
					max={120}
					step={1}
					onChange={(v) => {
						tuning.drainMax = v;
						refresh();
					}}
				/>
				<SliderRow
					label="Held speed start"
					value={tuning.heldSpeed.start}
					min={0.05}
					max={1}
					step={0.01}
					onChange={(v) => {
						tuning.heldSpeed.start = v;
						refresh();
					}}
				/>
				<SliderRow
					label="Loose speed start"
					value={tuning.looseSpeed.start}
					min={0.5}
					max={3}
					step={0.05}
					onChange={(v) => {
						tuning.looseSpeed.start = v;
						refresh();
					}}
				/>
				<SliderRow
					label="World every (s focus)"
					value={tuning.worldEveryS}
					min={15}
					max={90}
					step={5}
					onChange={(v) => {
						tuning.worldEveryS = v;
						refresh();
					}}
				/>

				<Pressable
					style={styles.btn}
					onPress={() => {
						Object.assign(tuning, cloneTuning());
						refresh();
					}}>
					<Text style={styles.btnText}>Reset tuning (clone)</Text>
				</Pressable>
				<Pressable
					style={styles.btn}
					onPress={() => {
						resetTuning();
						refresh();
					}}>
					<Text style={styles.btnText}>Reset to defaults</Text>
				</Pressable>
				<Pressable style={[styles.btn, styles.close]} onPress={onClose}>
					<Text style={styles.btnText}>Close</Text>
				</Pressable>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFill,
		zIndex: 3000,
		backgroundColor: "rgba(0,0,0,0.85)",
	},
	card: {
		padding: 20,
		paddingTop: 60,
		paddingBottom: 80,
	},
	title: {
		color: Colors.fontColor,
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 12,
	},
	meta: {
		color: Colors.grayColor,
		marginBottom: 16,
		fontSize: 13,
	},
	sliderBlock: {
		marginBottom: 12,
	},
	sliderLabel: {
		color: Colors.fontColor,
		fontSize: 14,
		marginBottom: 4,
	},
	btn: {
		borderWidth: 1,
		borderColor: Colors.fontColor,
		padding: 12,
		marginTop: 8,
		alignItems: "center",
	},
	close: {
		marginTop: 20,
	},
	btnText: {
		color: Colors.fontColor,
		fontSize: 16,
	},
});
