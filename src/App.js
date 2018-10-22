import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { KeepAwake, AppLoading, Asset, Font, Notifications } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import BannerAd from './shared/BannerAd'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  // ---- START NOTIFICIATION BINDING --- //

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    if (this._notificationSubscription) {
      this._notificationSubscription.remove();
    }
  }

  _registerForPushNotifications() {
    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };

  // ---- END NOTIFICIATION BINDING --- //

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <KeepAwake />
          <AppNavigator />
          <BannerAd></BannerAd>
        </View>
      </Provider>
    );

  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
      }),
    ]);
  };


  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
