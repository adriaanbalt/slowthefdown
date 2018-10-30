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

var { width, height } = Dimensions.get('window')

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
        paddingBottom: 0,
    },

    highscoreRow: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: "#FFF",
        borderBottomWidth: 1,
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
        // load the latest highscores when this page loads
        this.props
          .getHighscores()
          .then(highscores => {
            this.setState({ loading: true });
          })
          .catch(() => {
            this.setState({ loading: false });
          });
    }


    renderRow( obj, i ) {
        return (
            <View
                style={styles.highscoreRow}>
                <Text style={{
                    fontSize: i === 0 ? 22 : 16,
                    color: i === 0 ? Colors.firstPlaceFontColor : Colors.highscoresFontColor,
                }}>{i + 1}. </Text>
                <Text style={{
                    fontSize: i === 0 ? 22 : 16,
                    color: i === 0 ? Colors.firstPlaceFontColor : Colors.highscoresFontColor,
                }}>{obj.displayName.substring(0, 20)} </Text>
                <Text style={{
                    flex: 1,
                    fontSize: i === 0 ? 22 : 16,
                    color: i === 0 ? Colors.firstPlaceFontColor : Colors.highscoresFontColor,
                    textAlign: "right",
                    justifyContent: "flex-end",
                    alignSelf: "flex-end"
                }}>{obj.highscore}</Text>
            </View>
        )
    }

    render() {
        const {
            highscores,
            errorMessage,
        } = this.props;
        const dname = "Adriaan Balt Louis Scholvinck"
        return (
            <View style={styles.container}>
                <View>
                    <Header style={styles.header}>Top 10 Highscores</Header>
                    {highscores
                    .sort((a, b) => {
                        if (a.highscore < b.highscore) return 1;
                        if (a.highscore > b.highscore) return -1;
                        return 0;
                    })
                    .slice(0,10)
                    .map((obj, i) => (
                    <View
                        key={`highscore-${i}`}
                    >
                        {this.renderRow( obj, i )}
                    </View>
                    ))}
                </View>
                <NavigationUI navigation={this.props.navigation} />
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



