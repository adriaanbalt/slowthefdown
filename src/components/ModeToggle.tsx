import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";
import type { GameMode } from "@/state/settingsStore";

interface Props {
	value: GameMode;
	onChange: (mode: GameMode) => void;
	label?: string;
}

export default function ModeToggle({ value, onChange, label }: Props) {
	return (
		<View style={styles.wrap}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<View style={styles.row}>
				{(["classic", "focus"] as const).map((mode) => {
					const selected = value === mode;
					return (
						<Pressable
							key={mode}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							onPress={() => onChange(mode)}
							style={[styles.btn, selected && styles.btnSelected]}>
							<Text style={[styles.btnText, selected && styles.btnTextSelected]}>
								{mode === "classic" ? "Classic" : "Focus"}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginBottom: 16,
	},
	label: {
		color: Colors.fontColor,
		fontSize: 16,
		marginBottom: 8,
	},
	row: {
		flexDirection: "row",
		gap: 8,
	},
	btn: {
		flex: 1,
		borderWidth: 1,
		borderColor: Colors.fontColor,
		paddingVertical: 10,
		alignItems: "center",
	},
	btnSelected: {
		backgroundColor: Colors.fontColor,
	},
	btnText: {
		color: Colors.fontColor,
		fontSize: 15,
		fontWeight: "600",
	},
	btnTextSelected: {
		color: Colors.backgroundColor,
	},
});
