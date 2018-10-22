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
import ShareTheNavigation from "./shareTheNavigation"
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  text: {
      padding: 3
  }
});

class NavigationUI extends React.Component {

  render() {
    var { height, width } = Dimensions.get('window')
    return (
      <View
        style={[
          {
            position: 'absolute',
            zIndex: 1000,
            bottom: 100,
            width,
            height: 80,
            padding: 20,
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }
        ]}
      >
        <TouchableOpacity 
          style={{
            height: 23,
            backgroundColor: '#FFF',
          }}
          onPress={this.props.leftButtonClick}>
          <Text style={styles.text}>{this.props.leftButtonIcon}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{
            height: 23,
            right: 0,
            backgroundColor: '#FFF',
          }}
          onPress={this.props.rightButtonClick}>
          <Text style={styles.text}>{this.props.rightButtonIcon}</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default connect(state => ({
}), Dispatchers)(NavigationUI)
