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
        // this.props
        //   .getHighscores()
        //   .then(highscores => {
        //     this.setState({ loading: false });
        //   })
        //   .catch(() => {
        //     this.setState({ loading: false });
        //   });
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
        var { height, width } = Dimensions.get('window')
        
        return (
            <View style={styles.container}>
                <Text style={{
                    textAlign: 'center'
                }}>Highscores</Text>
                {highscores.sort( (a,b) => {
                    if ( a.highscore < b.highscore ) return 1
                    if ( a.highscore > b.highscore ) return -1
                    return 0;
                }).map((obj, i) => (
                    <View
                        style={{
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                        }} 
                        key={`highscore-${i}`}>
                        <Text style={{
                            width,
                            textAlign: 'center'
                        }}>{obj.displayName} - {obj.highscore}</Text>
                    </View>
                ))}
                <StyledButton title="Go To Game" onPress={this.navigateToGame} />
                <StyledButton title="Go To Your Profile" onPress={this.navigateToProfile} />
            </View>
        );
    }
}

export default connect(
    state => ({
        highscores: highscores(state),
    }),
    Dispatchers
)(HighscoresScreen);



