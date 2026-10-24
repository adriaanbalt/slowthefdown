import AntDesign from "@expo/vector-icons/AntDesign";
import type { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import Colors from "@/constants/Colors";

interface Props {
	iconName: ComponentProps<typeof AntDesign>["name"];
	onPress: () => void;
	diameter?: number;
	backgroundColor?: string;
	fontSize?: number;
	fontColor?: string;
	style?: StyleProp<ViewStyle>;
	iconStyle?: StyleProp<TextStyle>;
	accessibilityLabel?: string;
}

export default function ButtonCircle({
	iconName,
	onPress,
	diameter = 40,
	backgroundColor,
	fontSize = 25,
	fontColor = Colors.fontColor,
	style,
	iconStyle,
	accessibilityLabel,
}: Props) {
	return (
		<TouchableOpacity
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			style={[styles.container, style]}>
			<AntDesign
				name={iconName}
				size={fontSize}
				color={fontColor}
				style={[styles.icon, iconStyle]}
			/>
			<View
				style={[
					styles.circle,
					{ width: diameter, height: diameter, borderRadius: diameter / 2 },
					backgroundColor !== undefined && { backgroundColor },
				]}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		position: "absolute",
		zIndex: 1,
	},
	circle: {
		shadowOffset: { width: 0, height: 0 },
		shadowColor: Colors.shadowColor,
		shadowOpacity: Colors.shadowOpacity,
		shadowRadius: Colors.shadowRadius,
		borderWidth: 1,
		borderColor: "#fff",
	},
});
