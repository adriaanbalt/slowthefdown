import Expo from 'expo';
import React from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    TouchableOpacity,
    Image,
    Alert,
    Platform
} from 'react-native';
import {
  isAuthenticated,
  highscores
} from "../../redux/selectors";
import Dispatchers from '../../redux/dispatchers';
import StyledButton from '../../shared/StyledButton';
import Waiting from '../../shared/Waiting';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: Colors.buttonBackgroundColor
    },

    waiting: {
        backgroundColor: Colors.buttonBackgroundColor
    },

    scrollContainer: {
        flex: 1,
        backgroundColor: Colors.buttonBackgroundColor
    },

});

class HighscoresScreen extends React.Component {
    static navigationOptions = {
        header: null,
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
          .loadHighscores()
          .then(highscores => {
            this.setState({ loading: false });
          })
          .catch(() => {
            this.setState({ loading: false });
          });
    }

    renderLoggedIn() {
        const {
            profile
        } = this.props;

        // show highscore
        // show log out
        return (<ScrollView style={styles.scrollContainer}>
        </ScrollView>);
    }

    startFacebookLogin = () => {
        this.props.startFacebookLogin().catch(e => console.log(e.message));
    }

    render() {
        const {
            errorMessage
        } = this.props;

        console.log ( 'highscores render', this.props.highscores)
        

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
        //       <StyledButton title="Login with Facebook" onPress={this.startFacebookLogin} />
        //     </View>
        //   </TouchableWithoutFeedback>
        // );

        return (
            <View><Text>Highscores</Text></View>
        )
    }
}

export default connect(
    state => ({
        highscores: highscores(state),
    }),
    Dispatchers
)(HighscoresScreen);



