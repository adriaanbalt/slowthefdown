import React from "react";
import { StyleSheet, TextInput } from "react-native";
import COLORS from "../constants/Colors";

const styles = StyleSheet.create({
	input: {
		backgroundColor: "transparent",
		borderBottomColor: COLORS.fontColor,
		borderBottomWidth: 1,
		padding: 10,
		zIndex: 1,
		color: COLORS.fontColor,
		fontSize: 20,
	},
});

class Input extends React.Component {
	render() {
		const {
			placeholder,
			placeholderTextColor,
			style,
			onSubmitEditing,
			onChangeText,
			getRef,
			secureTextEntry,
			autoCompleteType,
			keyboardType,
			textContentType,
			value,
			multiline,
		} = this.props;

		return (
			<TextInput
				ref={(ref) => {
					if (getRef) {
						getRef(ref);
					}
				}}
				multiline={multiline}
				value={value}
				autoCompleteType={autoCompleteType}
				keyboardType={keyboardType}
				textContentType={textContentType}
				secureTextEntry={secureTextEntry}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={
					placeholderTextColor || COLORS.backgroundColor
				}
				style={[styles.input, style]}
				onSubmitEditing={onSubmitEditing}
			/>
		);
	}
}

export default Input;
