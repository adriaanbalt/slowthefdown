import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { KeepAwake, AppLoading, Asset, Font, Notifications } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import store from './redux/store';
import { Provider } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    // if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
    //   return (
    //     <AppLoading
    //       startAsync={this._loadResourcesAsync}
    //       onError={this._handleLoadingError}
    //       onFinish={this._handleFinishLoading}
    //     />
    //   );
    // }
    console.log('app ', (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) )
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          <KeepAwake />
          <AppNavigator />
        </View>
      </Provider>
    );

  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/stars.jpg'),
      ]),
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
