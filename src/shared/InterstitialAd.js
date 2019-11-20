import { AdMobInterstitial } from "expo-ads-admob";
import AdMob from "../constants/AdMob";

class InterstitialAd {
	constructor() {
		AdMobInterstitial.setAdUnitID(AdMob.interstitial); // Test ID, Replace with your-admob-unit-id
		// AdMobInterstitial.setTestDeviceID('EMULATOR');
	}

	async show() {
		console.log("SHOW!");

		await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
		await AdMobInterstitial.showAdAsync();
	}
}

export default InterstitialAd;
