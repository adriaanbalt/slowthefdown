import Expo, {
    AdMobBanner,
} from "expo"
import React from 'react'
import { connect } from 'react-redux'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from "react-native"
import Dispatchers from '../redux/dispatchers'
import AdMob from "../constants/AdMob";

var { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20
    },
});

class BannerAd extends React.Component {
  
    bannerError = (err) => {
        console.log ('error', err)
    }

  render() {
    return (
      <View style={styles.container}>
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={AdMob.bannerAdUnitId} // Test ID, Replace with your-admob-unit-id
          onDidFailToReceiveAdWithError={this.bannerError}
          testDevices="SIMULATOR"
        />
      </View>
    );
  }
}

export default connect(state => ({
}), Dispatchers)(BannerAd)
