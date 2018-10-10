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
import Dispatchers from '../../redux/dispatchers';
import StyledButton from '../../shared/StyledButton';
import Waiting from '../../shared/Waiting';
import Colors from '../../constants/Colors';
import { isAuthenticated, profile } from '../../redux/selectors';
import BASE_URL from '../../BASE_URL';

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

class Profile extends React.Component {
    static navigationOptions = {
        header: null,
        headerTitle: 'Home'
    };


    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.presses = [];
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.loadUser().then(user => {
            this.setState({ loading: false });

            // if (this.props.dates.length > 0) {
            //   this.props.navigation.navigate('Dates');
            // }
        }).catch(() => {
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
            <View><Text>Profile</Text></View>
        )
    }
}

export default connect(state => ({
    isAuthenticated: isAuthenticated(state),
    profile: profile(state),
}), Dispatchers)(Profile);



