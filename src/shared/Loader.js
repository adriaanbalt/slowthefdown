import React from "react";
import { connect } from "react-redux";
import {
	StyleSheet,
	View,
	Dimensions,
	ActivityIndicator,
	Text,
} from "react-native";
import Dispatchers from "../redux/dispatchers";

var { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		width,
		height,
		flex: 1,
		backgroundColor: "#000",
		paddingTop: 100,
	},
	text: {
		color: "#fff",
		textAlign: "center",
		marginBottom: 10,
	},
});

class LoaderScreen extends React.Component {
	componentDidMount = () => {
		// get the resources for this page
		// if the resources exist in the file system, just get them there.
		this.props.initialize(); // initialize the user auth

		// LOAD some DATA
		this.props.initialLoad(this.props.onFinish, this.props.onError);
		// this is a function in the `dispatcher.js`
		// it will load data for/from the file system
		// once loaded, it will store that data onto the store
		// once the data has been set on the store, the `this.props.lists` will automatically be changed
		// and thusly update the response of the store 'lists`
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Slow the F</Text>
				<ActivityIndicator color={"#fff"} size='large' />
			</View>
		);
	}
}

export default connect((state) => ({}), Dispatchers)(LoaderScreen);
