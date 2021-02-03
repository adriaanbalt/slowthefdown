import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import COLORS from "../constants/Colors";

const styles = StyleSheet.create({
	wrapper: {
		display: "flex",
		alignItems: "center",
		margin: 10,
		padding: 15,
		borderColor: COLORS.buttonBorderColor,
		borderWidth: 1,
	},
});

class ButtonBubble extends React.Component {
	render() {
		const { onPress, children, style } = this.props;

		return (
			<TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
				<Text
					style={{
						borderBottomColor: "#FFF",
						color: COLORS.fontColor,
						fontWeight: "bold",
					}}>
					{children}
				</Text>
			</TouchableOpacity>
		);
	}
}

export default ButtonBubble;
