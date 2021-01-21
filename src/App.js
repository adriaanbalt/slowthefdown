import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppNavigator from "./navigation/AppNavigator5x";
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

	render() {
		return (
			<Provider store={store}>
				<View style={styles.container}>
					<Loader />
					<Modal />
					<AppNavigator />
					<BannerAd />
				</View>
			</Provider>
		);
	}

	_handleLoadingError = (error) => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}
