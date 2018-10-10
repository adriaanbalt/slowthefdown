import { KeepAwake } from 'expo';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import Waiting from '../components/Waiting';
import { connect } from 'react-redux';
import Dispatchers from '../redux/dispatchers';
import StyledButton from '../components/StyledButton';
import { isAuthenticated } from '../redux/selectors';
import Game from '../Game/Game'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    // backgroundColor: 'white'
  },
});

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerTitle: 'Home'
  };

  constructor(props) {
    super(props);

    this.state = {
      fadeOutAnim: new Animated.Value(1),
      loading: true
    };

  }
  componentDidMount() {
    this.setState({ loading: true });
  }

  renderBody() {
    return (
      <Game/>
    );
  }

  render() {
    const {
      errorMessage
    } = this.props;
    return this.renderBody();

    if (this.state.loading || errorMessage) {
      return (
        <Waiting loading={this.state.loading} errorMessage={errorMessage} />
      );
    }

  }
}

export default connect(state => ({
  isAuthenticated: isAuthenticated(state)
}), Dispatchers)(HomeScreen);
