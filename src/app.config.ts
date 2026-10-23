import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
	name: "Slow the F Down",
	slug: "snack-slowitdown",
	description: "Adriaan Balt",
	version: "10.0.0",
	orientation: "portrait",
	icon: "./assets/app-icon.png",
	scheme: "slowthefdown",
	userInterfaceStyle: "dark",
	backgroundColor: "#000000",
	platforms: ["ios"],
	ios: {
		bundleIdentifier: "com.balt.slowitdown",
		buildNumber: "1",
		supportsTablet: true,
		googleServicesFile: "./GoogleService-Info.plist",
		entitlements: {
			// Release builds (TestFlight / App Store) must set APS_ENVIRONMENT=production in their EAS profile.
			"aps-environment": process.env.APS_ENVIRONMENT === "production" ? "production" : "development",
		},
		infoPlist: {
			UIBackgroundModes: ["remote-notification"],
			ITSAppUsesNonExemptEncryption: false,
		},
	},
	plugins: [
		"expo-router",
		[
			"expo-splash-screen",
			{
				backgroundColor: "#000000",
				image: "./assets/expo-icon.png",
				imageWidth: 96,
			},
		],
		"@react-native-firebase/app",
		"@react-native-firebase/auth",
		[
			"expo-build-properties",
			{
				ios: {
					useFrameworks: "dynamic",
				},
			},
		],
	],
	experiments: {
		typedRoutes: true,
		reactCompiler: true,
	},
};

export default config;
