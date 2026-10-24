import { Tabs } from "expo-router/tabs";

import FloatingTabBar from "@/components/FloatingTabBar";
import Colors from "@/constants/Colors";

export const unstable_settings = {
	anchor: "index",
};

export default function TabsLayout() {
	return (
		<Tabs
			tabBar={(props) => <FloatingTabBar {...props} />}
			screenOptions={{
				headerShown: false,
				sceneStyle: { backgroundColor: Colors.backgroundColor },
				// Keep the GL game loop scheduling reliable when switching tabs.
				freezeOnBlur: false,
			}}>
			<Tabs.Screen name="times" options={{ title: "Times" }} />
			<Tabs.Screen name="index" options={{ title: "Game" }} />
			<Tabs.Screen name="profile" options={{ title: "Profile" }} />
		</Tabs>
	);
}
