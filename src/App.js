import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { AppLoading } from "expo";
import { Ionicons } from "@expo/vector-icons";
import store from "./redux/store";
import AppNavigator from "./navigation/AppNavigator";
import BannerAd from "./shared/BannerAd";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
});

export default class App extends React.Component {
	state = {
		isLoadingComplete: false,
	};

	_activate = () => {
		activateKeepAwake();
	};

	_deactivate = () => {
		deactivateKeepAwake();
	};

	render() {
		if (!this.state.isLoadingComplete) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		}
		return (
			<Provider store={store}>
				<View style={styles.container}>
					<AppNavigator />
					<BannerAd />
				</View>
			</Provider>
		);
	}

	_loadResourcesAsync = async () => {
		return Promise.all([
			Font.loadAsync({
				// This is the font that we are using for our tab bar
				...Ionicons.font,
				// We include SpaceMono because we use it in HomeScreen.js. Feel free
				// to remove this if you are not using it in your app
			}),
		]);
	};

	_handleLoadingError = (error) => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}
