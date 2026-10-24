import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";

interface Props {
	/** 0..1 */
	focus: number;
	visible: boolean;
}

export default function FocusBar({ focus, visible }: Props) {
	if (!visible) return null;
	const pct = Math.max(0, Math.min(1, focus));
	return (
		<View style={styles.track} accessibilityLabel={`Focus ${Math.round(pct * 100)} percent`}>
			<View style={[styles.fill, { width: `${pct * 100}%` }]} />
		</View>
	);
}

const styles = StyleSheet.create({
	track: {
		width: "60%",
		height: 6,
		backgroundColor: "#333",
		borderRadius: 3,
		overflow: "hidden",
		marginTop: 8,
		alignSelf: "center",
	},
	fill: {
		height: "100%",
		backgroundColor: Colors.fontColor,
	},
});
