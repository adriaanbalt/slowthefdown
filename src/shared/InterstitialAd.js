import React from "react";
import { AdMobInterstitial } from "expo-ads-admob";
import AdMob from "../constants/AdMob";
import { connect } from "react-redux";
import Dispatchers from "../redux/dispatchers";
import { View } from "react-native";

class InterstitialAd extends React.Component {
	constructor() {
		super();
		this.playing = false;
		AdMobInterstitial.setAdUnitID(AdMob.interstitial); // Test ID, Replace with your-admob-unit-id
		// AdMobInterstitial.setTestDeviceID('EMULATOR');
		AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
			console.log("interstitialDidOpen"),
		);
		AdMobInterstitial.addEventListener("interstitialDidClose", () =>
			console.log("interstitialDidClose"),
		);
		console.log("this.props", this.props);
	}

	async show() {
		console.log("this.playing ", this.playing);
		await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
		await AdMobInterstitial.showAdAsync();
	}

	render() {
		return <View />;
	}
}

// export default InterstitialAd;

export default connect((state) => ({}), Dispatchers)(InterstitialAd);
