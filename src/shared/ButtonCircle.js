import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import Dispatchers from "../redux/dispatchers";
import COLORS from "../constants/Colors";

class ButtonCircle extends React.Component {
	styles = StyleSheet.create({
		container: {
			justifyContent: "center",
			alignItems: "center",
		},
		icon: {
			position: "absolute",
		},
		circle: {
			width: this.props.diameter ? this.props.diameter : 40,
			height: this.props.diameter ? this.props.diameter : 40,
			borderRadius: (this.props.diameter ? this.props.diameter : 40) / 2,
			shadowOffset: { width: 0, height: 0 },
			shadowColor: COLORS.shadowColor,
			shadowOpacity: COLORS.shadowOpacity,
			shadowRadius: COLORS.shadowRadius,
			zIndex: -1,
		},
	});

	render() {
		const { style, onPress } = this.props;

		let bgCircleStyles = this.styles.circle;
		if (this.props.backgroundColor) {
			bgCircleStyles = [
				this.styles.circle,
				{
					backgroundColor: this.props.backgroundColor,
				},
			];
		}
		return (
			<TouchableOpacity
				onPress={onPress}
				style={[this.styles.container, style]}>
				{this.props.children}
				<View style={bgCircleStyles} />
			</TouchableOpacity>
		);
	}
}

export default connect((state, props) => {
	return {};
}, Dispatchers)(ButtonCircle);
