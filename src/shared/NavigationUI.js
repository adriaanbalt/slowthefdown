import Expo from "expo";
import * as Icon from "@expo/vector-icons";
import React from "react";
import { connect } from "react-redux";
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import Dispatchers from "../redux/dispatchers";
import ShareTheNavigation from "./shareTheNavigation";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
	text: {
		padding: 3,
		textAlign: "center",
	},
});

class NavigationUI extends React.Component {
	navigateToGame = () => {
		this.props.navigation.navigate("Game", {});
	};
	navigateToProfile = () => {
		this.props.navigation.navigate("Profile", {});
	};
	navigateToHighscores = () => {
		this.props.navigation.navigate("Highscores", {});
	};
	render() {
		var { height, width } = Dimensions.get("window");
		return (
			<View
				style={[
					{
						position: "absolute",
						zIndex: 1000,
						top: height - 120, // avoid the banner
						width,
						height: 80,
						padding: 20,
						flex: 1,
						justifyContent: "space-between",
						flexDirection: "row",
					},
				]}>
				<TouchableOpacity
					style={{
						height: 23,
						width: 100,
						backgroundColor: "#FFF",
					}}
					onPress={this.navigateToHighscores}>
					<Text style={styles.text}>Times</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						height: 23,
						width: 100,
						backgroundColor: "#FFF",
					}}
					onPress={this.navigateToGame}>
					<Text style={styles.text}>Game</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						height: 23,
						right: 0,
						width: 100,
						backgroundColor: "#FFF",
					}}
					onPress={this.navigateToProfile}>
					<Text style={styles.text}>Profile</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default connect((state) => ({}), Dispatchers)(NavigationUI);
