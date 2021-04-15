import { AdMobBanner } from "expo-ads-admob";
import Expo from "expo";
import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import Dispatchers from "../redux/dispatchers";
import AdMob from "../constants/AdMob";

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingBottom: 0,
		transform: [{ translateX: "25%" }],
	},
});

class BannerAd extends React.Component {
	bannerError = (err) => {
		console.log("error", err);
	};

	render() {
		return (
			<View style={styles.container}>
				<AdMobBanner
					bannerSize={"banner"}
					adUnitID={AdMob.banner} // Test ID, Replace with your-admob-unit-id
					servePersonalizedAds // true or false
					onDidFailToReceiveAdWithError={this.bannerError}
				/>
			</View>
		);
	}
}

export default connect((state) => ({}), Dispatchers)(BannerAd);
