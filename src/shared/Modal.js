import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Dispatchers from "../redux/dispatchers";
import Colors from "../constants/Colors";

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
	modal: {
		width: 100,
		height,
		backgroundColor: "#0f0",
		zIndex: 10000,
	},
});

class Modal extends React.Component {
	render() {
		const { children } = this.props;
		return (
			<View className={styles.modal}>
				<View className={styles.content}>
					<View className={styles.inner}>
						<Text>Hi</Text>
						{children}
					</View>
				</View>
				<View
					className={styles.background}
					onClick={() => this.props.toggleModal({})}></View>
			</View>
		);
	}
}

export default connect(
	(state) => ({
		modal: state.ui.modal,
	}),
	Dispatchers,
)(Modal);
