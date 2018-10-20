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
import Colors from '../../constants/Colors';
import NavigationUI from '../../shared/NavigationUI'
import Header from '../../shared/Header'
import { translate } from 'gl-matrix/src/gl-matrix/mat4';

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

    highscoreRow: {
        height: 40,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
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
        this.props.navigation.navigate("Game", {});
    }
    navigateToProfile = () => {
        this.props.navigation.navigate("Profile", {});
    }

    render() {
        const {
            errorMessage,
            highscores
        } = this.props;
        
        return (
            <View style={styles.container}>
                <View>
                    <Header>Highscores</Header>
                    {highscores.sort( (a,b) => {
                        if ( a.highscore < b.highscore ) return 1
                        if ( a.highscore > b.highscore ) return -1
                        return 0;
                    }).map((obj, i) => (
                        <View
                            style={styles.highscoreRow} 
                            key={`highscore-${i}`}>
                            <Text style={{
                                textAlign: 'center',
                                color: Colors.fontColor,
                            }}>{i+1}. {obj.displayName} - {obj.highscore}</Text>
                        </View>
                    ))}
                </View>
                <NavigationUI 
                    leftButtonIcon={'Game'}
                    leftButtonClick={this.navigateToGame}
                    rightButtonIcon={'Profile'}
                    rightButtonClick={this.navigateToProfile} />
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



