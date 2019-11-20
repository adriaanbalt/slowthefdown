import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import HighscoresScreen from "../screens/Highscores";

const AppNavigator = createStackNavigator(
	{
		Profile: {
			screen: ProfileScreen,
		},
		Game: {
			screen: HomeScreen,
		},
		Highscores: {
			screen: HighscoresScreen,
		},
	},
	{
		initialRouteName: "Game",
	},
);

export default AppNavigator;
