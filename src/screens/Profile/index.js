import Expo from 'expo';
import React from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
} from 'react-native';
import Dispatchers from '../../redux/dispatchers';
import StyledButton from '../../shared/StyledButton';
import Waiting from '../../shared/Waiting';
import Colors from '../../constants/Colors';
import { isAuthenticated, profile } from '../../redux/selectors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        padding: 20,
        transform: [
            { translateY: Dimensions.get('window').height * 0.24 },
        ],
    },

    waiting: {
        backgroundColor: Colors.buttonBackgroundColor
    },

    scrollContainer: {
        flex: 1,
        backgroundColor: Colors.buttonBackgroundColor
    },

});

class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props
      .login()
      .then(user => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  navigateToGame = () => {
    this.props.navigation.navigate("Home", {});
  };
  navigateToHighscores = () => {
    this.props.navigation.navigate("Highscores", {});
  };
  render() {
    const { errorMessage } = this.props;

    // if (this.state.loading || errorMessage) {
    //   return (
    //     <Waiting style={styles.waiting} loading={this.state.loading} errorMessage={errorMessage} onReset={this.props.resetPhoneNumberVerification} />
    //   );
    // }

    // if (this.props.isAuthenticated && this.props.profile) {
    //   return this.renderLoggedIn();
    // }

    // return (
    //   <TouchableWithoutFeedback onPress={() => this.handleTester()}>
    //     <View style={styles.container}>
    //       <StyledButton title="Login with Facebook" onPress={this.login} />
    //     </View>
    //   </TouchableWithoutFeedback>
    // );

    console.log('this.props.profile', this.props.profile )
    return (
      <ScrollView style={styles.container}>
        <Text>Profile</Text>
        {
          this.props.isAuthenticated
          &&
          this.props.profile
          &&
          <View>
            {
              this.props.profile.photoURL
              &&
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: this.props.profile.photoURL }}
              />
            }
            <Text>{ this.props.profile.displayName }</Text>
            <Text>Highscore: { this.props.profile.highscore }</Text>
          </View>
        }
        {
          !this.props.isAuthenticated
          &&
          <StyledButton title="Login" onPress={this.props.login} />
        }
        {
          this.props.isAuthenticated
          &&
          <StyledButton title="Logout" onPress={this.props.logout} />
        }
        <StyledButton title="Go To Game" onPress={this.navigateToGame} />
        <StyledButton
          title="Go To Your Highscores"
          onPress={this.navigateToHighscores}
        />
      </ScrollView>
    );
  }
}

export default connect(state => ({
    isAuthenticated: isAuthenticated(state),
    profile: profile(state),
}), Dispatchers)(ProfileScreen);



