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

var { width, height } = Dimensions.get("window"); 
const styles = StyleSheet.create({
    container: {
      width,
      height,
      flex: 1,
      paddingTop: height > 600 ? 50 : 10, // for smaller phones
      padding: 20,
      backgroundColor: Colors.backgroundColor,
    },

    header: {
        paddingBottom: 20,
    },

    displayName: {
      paddingTop: 10,
      paddingBottom: 10,
      color: Colors.fontColor,
      fontSize: 25,
    },

    body: {
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
      .checkUserAccessToken()
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
    console.log("this.props.isAuthenticated", this.props.isAuthenticated);
    const { errorMessage } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Header style={styles.header}>Profile</Header>
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
            this.props.profile.highscore
            &&
            this.props.profile.displayName
            &&
            <View style={{
              paddingBottom: 20,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
              <View>
                <Text style={styles.displayName}>{ this.props.profile.displayName }</Text>
                <Text style={styles.body}>Highscore: { this.props.profile.highscore }</Text>
              </View>
              {
                false
                &&
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
        <NavigationUI navigation={this.props.navigation} />
      </View>
    );
  }
}

export default connect(state => ({
    isAuthenticated: isAuthenticated(state),
    profile: profile(state),
}), Dispatchers)(ProfileScreen);



