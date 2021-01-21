import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import COLORS from "../constants/Colors";

import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import HighscoresScreen from "../screens/Highscores";
import ModalLoginPhone from "../screens/ModalLoginPhone";

import PAGE_TRANSITIONS from "../utils/PAGE_TRANSITIONS";
import { View } from "react-native";

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
				showLabel: true,
				activeTintColor: "#000",
				inactiveTintColor: "#000",
				tabStyle: {
					backgroundColor: "#0f0",
					backgroundColor: "#fff",
					marginTop: 5,
					marginBottom: 5,
					marginRight: 10,
					marginLeft: 10,
					textAlign: "center",
				},
				labelStyle: {
					fontSize: 12,
					position: "absolute",
					top: "25%",
				},
				style: {
					left: "5%",
					width: "90%",
					paddingBottom: 10,
					position: "absolute",
				},
			}}>
			<Tab.Screen
				name='Times'
				component={HighscoresScreen}
				options={{
					headerShown: false,
					tabBarIcon: () => (
						<View
							style={{
								display: "none",
								backgroundColor: "#0f0",
								width: 0,
								height: 0,
							}}
						/>
					),
				}}
			/>
			<Tab.Screen
				name='Game'
				component={HomeScreen}
				options={{
					headerShown: false,
					tabBarIcon: () => (
						<View
							style={{
								display: "none",
								backgroundColor: "#0f0",
								width: 0,
								height: 0,
							}}
						/>
					),
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					headerShown: false,
					tabBarIcon: () => (
						<View
							style={{
								display: "none",
								backgroundColor: "#0f0",
								width: 0,
								height: 0,
							}}
						/>
					),
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
