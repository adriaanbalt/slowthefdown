import * as Linking from "expo-linking";

export default function () {
	try {
		const url = "https://www.greatflix.app/privacy";
		Linking.canOpenURL(url).then((supported) => {
			if (supported) {
				Linking.openURL(url);
			}
		});
	} catch (err) {
		console.log("Privacy Policy onPress 'Linking' Error");
	}
}
