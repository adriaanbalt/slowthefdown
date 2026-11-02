import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";
import { SELECTABLE_WORLDS, WORLD_LABELS, type WorldId } from "@/game/worldSchedule";

interface Props {
	value: WorldId | null;
	onChange: (world: WorldId | null) => void;
	label?: string;
}

export default function WorldPicker({ value, onChange, label }: Props) {
	const options: { id: WorldId | null; title: string }[] = [
		{ id: null, title: "Auto" },
		...SELECTABLE_WORLDS.map((id) => ({ id, title: WORLD_LABELS[id] })),
	];

	return (
		<View style={styles.wrap}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<View style={styles.row}>
				{options.map(({ id, title }) => {
					const selected = value === id;
					return (
						<Pressable
							key={id ?? "auto"}
							accessibilityRole="button"
							accessibilityState={{ selected }}
							onPress={() => onChange(id)}
							style={[styles.chip, selected && styles.chipSelected]}>
							<Text style={[styles.chipText, selected && styles.chipTextSelected]}>
								{title}
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
		flexWrap: "wrap",
		gap: 8,
	},
	chip: {
		borderWidth: 1,
		borderColor: Colors.fontColor,
		paddingVertical: 8,
		paddingHorizontal: 14,
	},
	chipSelected: {
		backgroundColor: Colors.fontColor,
	},
	chipText: {
		color: Colors.fontColor,
		fontSize: 15,
		fontWeight: "600",
	},
	chipTextSelected: {
		color: Colors.backgroundColor,
	},
});
