import type { BottomTabBarProps } from "expo-router/tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function FloatingTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
	return (
		<View style={[styles.bar, { paddingBottom: Math.max(10, insets.bottom) }]}>
			{state.routes.map((route, index) => {
				const focused = state.index === index;
				const options = descriptors[route.key]?.options;
				const label = options?.title ?? route.name;
				return (
					<Pressable
						key={route.key}
						accessibilityRole="tab"
						accessibilityState={{ selected: focused }}
						style={styles.tab}
						onPress={() => {
							const event = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
							if (!focused && !event.defaultPrevented) navigateToTab(route.key);
						}}>
						<Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	bar: {
		position: "absolute",
		bottom: 0,
		left: "5%",
		width: "90%",
		flexDirection: "row",
	},
	tab: {
		flex: 1,
		height: 40,
		marginVertical: 5,
		marginHorizontal: 10,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		fontSize: 12,
		color: "#000",
	},
	labelFocused: {
		fontWeight: "bold",
	},
});
