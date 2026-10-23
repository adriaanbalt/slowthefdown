import { DarkTheme, Stack, ThemeProvider, type Theme } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import Colors from "@/constants/Colors";
import Loader from "@/shared/Loader";
import { useLeaderboardStore } from "@/state/leaderboardStore";
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

	useEffect(() => {
		const stopUser = useUserStore.getState().init();
		const stopLeaderboard = useLeaderboardStore.getState().subscribe();
		const splashTimeout = setTimeout(() => void SplashScreen.hideAsync(), SPLASH_TIMEOUT_MS);
		return () => {
			stopUser();
			stopLeaderboard();
			clearTimeout(splashTimeout);
		};
	}, []);

	useEffect(() => {
		if (ready) void SplashScreen.hideAsync();
	}, [ready]);

	return (
		<ThemeProvider value={theme}>
			<StatusBar style="light" />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="login-phone" options={{ presentation: "modal" }} />
			</Stack>
			<Loader />
		</ThemeProvider>
	);
}
