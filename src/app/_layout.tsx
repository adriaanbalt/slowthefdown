import Constants from "expo-constants";
import { DarkTheme, Stack, ThemeProvider, type Theme } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Linking } from "react-native";

import Colors from "@/constants/Colors";
import { fetchAppStoreUpdate, type AppStoreUpdate } from "@/services/appStoreVersion";
import { applyLaunchUpdate, isUpdatesActive, type LaunchUpdateStatus } from "@/services/updates";
import Loader from "@/shared/Loader";
import UpdatePrompt from "@/shared/UpdatePrompt";
import { useLeaderboardStore } from "@/state/leaderboardStore";
import { useSettingsStore } from "@/state/settingsStore";
import { useUserStore } from "@/state/userStore";

void SplashScreen.preventAutoHideAsync();

const theme: Theme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: Colors.backgroundColor,
		card: Colors.backgroundColor,
	},
};

const SPLASH_TIMEOUT_MS = 3000;

export default function RootLayout() {
	const ready = useUserStore((s) => s.ready);
	const settingsHydrated = useSettingsStore((s) => s.hydrated);
	const [updateStatus, setUpdateStatus] = useState<LaunchUpdateStatus>("idle");
	const [launchUpdateDone, setLaunchUpdateDone] = useState(false);
	const [storeUpdate, setStoreUpdate] = useState<AppStoreUpdate | null>(null);

	useEffect(() => {
		const stopUser = useUserStore.getState().init();
		const stopLeaderboard = useLeaderboardStore.getState().subscribe();
		const splashTimeout = setTimeout(() => void SplashScreen.hideAsync(), SPLASH_TIMEOUT_MS);
		void applyLaunchUpdate(setUpdateStatus).finally(() => setLaunchUpdateDone(true));
		return () => {
			stopUser();
			stopLeaderboard();
			clearTimeout(splashTimeout);
		};
	}, []);

	// Runs after the OTA check: if an OTA applied, the app has already reloaded and this never fires.
	// nativeAppVersion is the installed binary; skipped in dev/Expo Go like OTA.
	useEffect(() => {
		const installed = Constants.nativeAppVersion;
		if (!launchUpdateDone || !installed || !isUpdatesActive()) return;
		void fetchAppStoreUpdate(installed).then(setStoreUpdate);
	}, [launchUpdateDone]);

	useEffect(() => {
		if (settingsHydrated) useSettingsStore.getState().applyDefaultOnLaunch();
	}, [settingsHydrated]);

	useEffect(() => {
		if (ready && launchUpdateDone) void SplashScreen.hideAsync();
	}, [ready, launchUpdateDone]);

	return (
		<ThemeProvider value={theme}>
			<StatusBar style="light" />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="login-phone" options={{ presentation: "modal" }} />
			</Stack>
			<Loader status={updateStatus} />
			<UpdatePrompt
				visible={storeUpdate !== null}
				title="A new version is available"
				message={`Version ${storeUpdate?.version ?? ""} is on the App Store.`}
				actionLabel="Update"
				dismissLabel="Later"
				onAction={() => {
					if (storeUpdate) void Linking.openURL(storeUpdate.url);
				}}
				onDismiss={() => setStoreUpdate(null)}
			/>
		</ThemeProvider>
	);
}
