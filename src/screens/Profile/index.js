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
import NavigationUI from '../../shared/NavigationUI'
import Header from "../../shared/Header";
import { isAuthenticated, profile } from '../../redux/selectors';

var { height, width } = Dimensions.get('window') 
const styles = StyleSheet.create({
    container: {
      width,
      height,
      flex: 1,
      paddingTop: 50,
      padding: 20,
      backgroundColor: Colors.backgroundColor,
    },
    textDisplayName: {
      paddingTop: 10,
      paddingBottom: 10,
      color: Colors.fontColor,
      fontSize: 25,
    },
    textHighscore: {
      paddingTop: 10,
      paddingBottom: 10,
      color: Colors.fontColor,
      fontSize: 20,
    },
    picture: {
      alignSelf: 'flex-end',
      width: 75,
      height: 75,
    }
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
    this.props.navigation.navigate("Game", {});
  };
  navigateToHighscores = () => {
    this.props.navigation.navigate("Highscores", {});
  };
  render() {
    const { errorMessage } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Header>Profile</Header>
          <View style={{
            justifyContent: 'space-between',
            alignContent: 'space-between',
            flexDirection: 'column',
          }}>
          {
            this.props.isAuthenticated
            &&
            this.props.profile
            &&
            <View style={{
              paddingBottom: 20,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
              <View>
                <Text style={styles.textDisplayName}>{ this.props.profile.displayName }</Text>
                <Text style={styles.textHighscore}>Highscore: { this.props.profile.highscore }</Text>
              </View>
              {
                this.props.profile.photoURL
                &&
                <Image
                  style={styles.picture}
                  source={{ uri: this.props.profile.photoURL }}
                />
              }
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
          </View>
        </View>
        <NavigationUI 
          leftButtonIcon={'Game'}
          leftButtonClick={this.navigateToGame}
          rightButtonIcon={'Highscores'}
          rightButtonClick={this.navigateToHighscores} />
      </View>
    );
  }
}

export default connect(state => ({
    isAuthenticated: isAuthenticated(state),
    profile: profile(state),
}), Dispatchers)(ProfileScreen);



