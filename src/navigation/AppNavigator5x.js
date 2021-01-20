import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import COLORS from "../constants/Colors";

import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import HighscoresScreen from "../screens/Highscores";

import ModalLoginPhone from "../modals/ModalLoginPhone";

import PAGE_TRANSITIONS from "../utils/PAGE_TRANSITIONS";

const MyTheme = {
	dark: false,
	colors: {
		background: COLORS.backgroundColor,
	},
};

function Tabs() {
	const Tab = createBottomTabNavigator();
	return (
		<Tab.Navigator
			initialRouteName='Game'
			tabBarOptions={{
				showLabel: false,
				activeTintColor: "#fff",
				inactiveTintColor: "#fff",
				style: {
					bottom: 30,
					justifyContent: "center",
					left: "20%",
					width: "60%",
					paddingBottom: 10,
					borderRadius: 20,
					position: "absolute",
					borderTopColor: "transparent",
					backgroundColor: Variables.backgroundColorTransparent,
					shadowOffset: { width: 0, height: 0 },
					shadowColor: Variables.shadowColor,
					shadowOpacity: 0.75,
					shadowRadius: 5,
				},
			}}>
			<Tab.Screen
				name='Times'
				component={HighscoresScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name='Game'
				component={HomeScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}

export default function AppNavigator() {
	const Stack = createStackNavigator();
	return (
		<NavigationContainer
			theme={MyTheme}
			onStateChange={(prevState, currentState, action) => {
				// const currentRouteName = this.getActiveRouteName(currentState);
				// const previousRouteName = this.getActiveRouteName(prevState);
				// if (previousRouteName !== currentRouteName) {
				// 	AppAnalytics.viewedScreen(currentRouteName);
				// }
			}}>
			<Stack.Navigator mode='modal' initialRouteName='Tabs'>
				<Stack.Screen
					name='Tabs'
					component={Tabs}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name='ModalLoginPhone'
					component={ModalLoginPhone}
					options={{
						headerShown: false,
						...PAGE_TRANSITIONS.MODAL,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
