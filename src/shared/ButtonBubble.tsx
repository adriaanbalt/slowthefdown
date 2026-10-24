import type { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";

import Colors from "@/constants/Colors";

const styles = StyleSheet.create({
	wrapper: {
		display: "flex",
		alignItems: "center",
		margin: 10,
		padding: 15,
		borderColor: Colors.buttonBorderColor,
		borderWidth: 1,
	},
	text: {
		color: Colors.fontColor,
		fontWeight: "bold",
	},
});

interface Props {
	children: ReactNode;
	onPress: () => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export default function ButtonBubble({ children, onPress, disabled, style }: Props) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			style={[styles.wrapper, disabled && { opacity: 0.5 }, style]}>
			<Text style={styles.text}>{children}</Text>
		</TouchableOpacity>
	);
}
