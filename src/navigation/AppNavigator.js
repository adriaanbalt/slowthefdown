import "react-native-gesture-handler"
import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation"

import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import HighscoresScreen from "../screens/Highscores";

const MainNavigator = createSwitchNavigator(
    {
        Profile: ProfileScreen,
		Game: HomeScreen,
		Highscores: HighscoresScreen,
    },
    {
        initialRouteName: "Game",
    },
);

export default createAppContainer(MainNavigator);
