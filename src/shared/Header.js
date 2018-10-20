import Expo, { Icon } from "expo"
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
import Colors from "../constants/Colors";
import ShareTheNavigation from "./shareTheNavigation"
import { Ionicons } from '@expo/vector-icons';

var { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20
  },
  text: {
    color: "#FFF",
    padding: 3,
    textAlign: "center",
    fontSize: 30,
  }
});

class Header extends React.Component {

  render() {
    var { height, width } = Dimensions.get('window')
    return (
      <View
        style={styles.container}
      >
          <Text style={styles.text}>{this.props.children}</Text>
      </View>
    )
  }

}

export default connect(state => ({
}), Dispatchers)(Header)
