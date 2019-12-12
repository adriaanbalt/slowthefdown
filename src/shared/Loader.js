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

export default class LoaderScreen extends React.Component {
	componentDidMount = async () => {
		try {
			Updates.checkForUpdateAsync().then((res) => {
				alert("res" + res.isAvailable);
				if (res.isAvailable) {
					alert("getting new");
					Updates.fetchUpdateAsync().then(() => {
						alert("reloading");
						// ... notify user of update ...
						Updates.reloadFromCache();
					});
				}
			});
			// const update = await Updates.checkForUpdateAsync();
			// alert("update" + update.isAvailable);
			// if (update.isAvailable) {
			// await Updates.fetchUpdateAsync();
			// // ... notify user of update ...
			// Updates.reloadFromCache();
			// }
			this.props.onFinish();
		} catch (e) {
			// handle or log error
		}
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
