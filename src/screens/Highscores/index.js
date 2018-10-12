import Expo from 'expo';
import React from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {
  isAuthenticated,
  highscores
} from "../../redux/selectors";
import Dispatchers from '../../redux/dispatchers';
import StyledButton from '../../shared/StyledButton';
import Waiting from '../../shared/Waiting';
import Colors from '../../constants/Colors';
import { translate } from 'gl-matrix/src/gl-matrix/mat4';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        padding: 20,
        transform: [
        { translateY: Dimensions.get('window').height * 0.24 },
        ],
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
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

    navigateToGame = () => {
        this.props.navigation.navigate("Home", {});
    }
    navigateToProfile = () => {
        this.props.navigation.navigate("Profile", {});
    }

    render() {
        const {
            errorMessage,
            highscores
        } = this.props;
        
        return <ScrollView style={styles.container}>
            <Text>Highscores</Text>
            {highscores.map((obj, i) => (
              <Text key={`highscore-${i}`}>{obj.highscore}</Text>
            ))}
            <StyledButton title="Go To Game" onPress={this.navigateToGame} />
            <StyledButton title="Go To Your Profile" onPress={this.navigateToProfile} />
          </ScrollView>;
    }
}

export default connect(
    state => ({
        highscores: highscores(state),
    }),
    Dispatchers
)(HighscoresScreen);


