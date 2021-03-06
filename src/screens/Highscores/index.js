import Expo from "expo";
import React from "react";
import { connect } from "react-redux";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { highscores } from "../../redux/selectors";
import Dispatchers from "../../redux/dispatchers";
import Colors from "../../constants/Colors";
import Header from "../../shared/Header";

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		flex: 1,
		paddingTop: 50, // for smaller phones
		padding: 20,
		backgroundColor: Colors.backgroundColor,
	},

	header: {
		paddingBottom: 0,
	},

	highscoreRow: {
		flexWrap: "nowrap",
		flexDirection: "row",
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomColor: "#FFF",
		borderBottomWidth: 1,
	},
	scrollView: {
		paddingBottom: 20,
	},
});

class HighscoresScreen extends React.Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		// load the latest highscores when this page loads
		// this.props
		// 	.getHighscores()
		// 	.then((highscores) => {
		// 		this.setState({ loading: true });
		// 	})
		// 	.catch(() => {
		// 		this.setState({ loading: false });
		// 	});
	}

	renderRow(personObj, i) {
		return (
			<View style={styles.highscoreRow}>
				<Text
					style={{
						fontSize: i === 0 ? 22 : 16,
						color:
							i === 0
								? Colors.firstPlaceFontColor
								: Colors.highscoresFontColor,
					}}>
					{i + 1}.{" "}
				</Text>
				<Text
					style={{
						fontSize: i === 0 ? 22 : 16,
						color:
							i === 0
								? Colors.firstPlaceFontColor
								: Colors.highscoresFontColor,
					}}>
					{personObj.displayName &&
						personObj.displayName.substring(0, 20)}{" "}
				</Text>
				<Text
					style={{
						flex: 1,
						fontSize: i === 0 ? 22 : 16,
						color:
							i === 0
								? Colors.firstPlaceFontColor
								: Colors.highscoresFontColor,
						textAlign: "right",
						justifyContent: "flex-end",
						alignSelf: "flex-end",
					}}>
					{personObj.highscore}
				</Text>
			</View>
		);
	}

	render() {
		const { highscores, errorMessage } = this.props;
		const dname = "Adriaan Balt Louis Scholvinck";
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<Header style={styles.header}>Slow Down Times</Header>
					<View style={styles.scrollView}>
						{highscores
							.sort((a, b) => {
								if (a.highscore < b.highscore) return 1;
								if (a.highscore > b.highscore) return -1;
								return 0;
							})
							.map((personObj, i) => (
								<View key={`highscore-${i}`}>
									{this.renderRow(personObj, i)}
								</View>
							))}
					</View>
				</ScrollView>
			</View>
		);
	}
}

export default connect(
	(state) => ({
		highscores: highscores(state),
	}),
	Dispatchers,
)(HighscoresScreen);
