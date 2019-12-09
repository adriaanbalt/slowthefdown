import Expo, { Updates } from "expo";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { Ionicons } from "@expo/vector-icons";
import store from "./redux/store";
import AppNavigator from "./navigation/AppNavigator";
import BannerAd from "./shared/BannerAd";
import Loader from "./shared/Loader";
import Colors from "./constants/Colors";
import Modal from "./shared/Modal";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
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
		return (
			<Provider store={store}>
				<React.Fragment>
					{!this.state.isLoadingComplete && (
						<Loader
							onFinish={this._handleFinishLoading}
							onError={this._handleLoadingError}
						/>
					)}
					{this.state.isLoadingComplete && (
						<View style={styles.container}>
							<Modal />
							<AppNavigator />
							<BannerAd />
						</View>
					)}
				</React.Fragment>
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
