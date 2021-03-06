import React from "react";
import { TextInput } from "react-native";

const Input = (props) => {
	const [value, onChangeText] = React.useState(props.placeholder);

	return (
		<TextInput
			style={props.style}
			onChangeText={(text) => {
				props.onChangeText(text);
				onChangeText(text);
			}}
			value={value}
			onFocus={props.onFocus}
		/>
	);
};

export default Input;
