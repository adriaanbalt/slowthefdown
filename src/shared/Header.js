import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import Dispatchers from "../redux/dispatchers";

const styles = StyleSheet.create({
	text: {
		color: "#FFF",
		padding: 3,
		textAlign: "center",
		fontSize: 30,
	},
});

class Header extends React.Component {
	render() {
		return (
			<View style={this.props.style}>
				<Text style={styles.text}>{this.props.children}</Text>
			</View>
		);
	}
}

export default connect((state) => ({}), Dispatchers)(Header);
