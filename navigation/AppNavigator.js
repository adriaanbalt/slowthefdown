import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from "../screens/Home";
import ProfileScreen from '../screens/ProfileScreen';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Profile: {
      screen: ProfileScreen
    },
  },
  {
    initialRouteName: 'Home'
  }
);


export default AppNavigator;