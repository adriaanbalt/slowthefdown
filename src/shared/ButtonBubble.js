import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../constants/Colors";

const styles = StyleSheet.create({
	circle: {
		display: "flex",
		zIndex: -1,
		alignItems: "center",
		margin: 10,
		padding: 10,
		borderRadius: 20,
		backgroundColor: COLORS.red,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: COLORS.shadowColor,
		shadowOpacity: COLORS.shadowOpacity,
		shadowRadius: COLORS.shadowRadius,
	},
});

class ButtonBubble extends React.Component {
	render() {
		const { onPress, children, style } = this.props;

		return (
			<TouchableOpacity onPress={onPress} style={[styles.circle, style]}>
				{children}
			</TouchableOpacity>
		);
	}
}

export default ButtonBubble;
