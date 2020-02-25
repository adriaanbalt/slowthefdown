import React from "react";
import { Updates } from "expo";
import {
	StyleSheet,
	View,
	Dimensions,
	ActivityIndicator,
	Text,
} from "react-native";

var { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		width: width,
		height: height,
		flex: 1,
		position: "absolute",
		zIndex: 1000,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	modal: {
		width: width / 1.25,
		height: height / 2,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		borderColor: "#FFF",
		borderWidth: 1,
		padding: 20,
		justifyContent: "center",
		alignContent: "center",
		textAlign: "center",
		position: "absolute",
		zIndex: 1000,
	},
	text1: {
		color: "#fff",
		textAlign: "center",
		marginBottom: 5,
		fontSize: 15,
	},
	text2: {
		color: "#fff",
		textAlign: "center",
		marginBottom: 25,
		fontSize: 15,
	},
	h1: {
		fontWeight: "bold",
		color: "#fff",
		textAlign: "center",
		marginBottom: 25,
		fontSize: 20,
	},
});

export default class LoaderScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			updateAvailable: false,
		};
	}
	componentDidMount = async () => {
		try {
			const update = await Updates.checkForUpdateAsync();
			if (update.isAvailable) {
				this.setState({
					updateAvailable: true,
				});
				await Updates.fetchUpdateAsync();
				setTimeout(function() {
					Updates.reloadFromCache();
				}, 1000);
			}
		} catch (e) {
			console.log("error when checking for update async");
		}
	};

	render() {
		if (!this.state.updateAvailable) {
			return <React.Fragment />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.modal}>
					<Text style={styles.h1}>There is an app update!</Text>
					<Text style={styles.text1}>The app will reload</Text>
					<Text style={styles.text2}>and you'll be all set.</Text>
					<ActivityIndicator color={"#fff"} size='large' />
				</View>
			</View>
		);
	}
}
