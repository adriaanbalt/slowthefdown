import { StyleSheet, TextInput, type TextInputProps } from "react-native";

import Colors from "@/constants/Colors";

const styles = StyleSheet.create({
	input: {
		backgroundColor: "transparent",
		borderBottomColor: Colors.fontColor,
		borderBottomWidth: 1,
		padding: 10,
		zIndex: 1,
		color: Colors.fontColor,
		fontSize: 20,
	},
});

export default function Input({ style, placeholderTextColor, ...props }: TextInputProps) {
	return (
		<TextInput
			{...props}
			placeholderTextColor={placeholderTextColor ?? Colors.backgroundColor}
			style={[styles.input, style]}
		/>
	);
}
