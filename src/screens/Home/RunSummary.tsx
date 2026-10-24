import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";
import { formatFocusTime, formatStoredScore, formatTimerMs } from "@/game/format";

export interface RunSummaryData {
	focusTenths: number;
	runTimeS: number;
	recoveries: number;
	bestTenths: number;
}

interface Props {
	data: RunSummaryData;
	onDismiss: () => void;
}

export default function RunSummary({ data, onDismiss }: Props) {
	return (
		<Pressable style={styles.overlay} onPress={onDismiss} accessibilityRole="button">
			<View style={styles.card}>
				<Text style={styles.title}>Run over</Text>
				<Text style={styles.row}>Focus {formatTimerMs(Math.floor(data.focusTenths * 100))}</Text>
				<Text style={styles.row}>Length {formatFocusTime(Math.floor(data.runTimeS * 10))}</Text>
				<Text style={styles.row}>Recoveries {data.recoveries}</Text>
				<Text style={styles.row}>Best {formatStoredScore(data.bestTenths)}</Text>
				<Text style={styles.hint}>Tap to continue</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFill,
		zIndex: 2000,
		backgroundColor: "rgba(0,0,0,0.65)",
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	card: {
		width: "100%",
		maxWidth: 340,
		borderWidth: 1,
		borderColor: Colors.fontColor,
		padding: 24,
		backgroundColor: Colors.backgroundColor,
	},
	title: {
		color: Colors.fontColor,
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 16,
	},
	row: {
		color: Colors.fontColor,
		fontSize: 18,
		marginBottom: 8,
		textAlign: "center",
		fontVariant: ["tabular-nums"],
	},
	hint: {
		color: Colors.grayColor,
		textAlign: "center",
		marginTop: 16,
		fontSize: 14,
	},
});
