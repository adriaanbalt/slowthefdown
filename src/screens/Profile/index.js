import Expo from "expo";
import React from "react";
import { connect } from "react-redux";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	TextInput,
} from "react-native";
import Dispatchers from "../../redux/dispatchers";
import StyledButton from "../../shared/StyledButton";
import Waiting from "../../shared/Waiting";
import Colors from "../../constants/Colors";
import NavigationUI from "../../shared/NavigationUI";
import Header from "../../shared/Header";
import {
	isAuthenticated,
	getPropertyFromState,
	profile,
} from "../../redux/selectors";

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
		alignSelf: "flex-end",
		width: 75,
		height: 75,
	},
});

class ProfileScreen extends React.Component {
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
		this.setState({ loading: true });
		this.props
			.login()
			.then((user) => {
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
		console.log("Profile Props", this.props.confirmResults);

		const { errorMessage } = this.props;
		return (
			<View style={styles.container}>
				<View>
					<Header style={styles.header}>Profile</Header>
					<View
						style={{
							justifyContent: "space-between",
							alignContent: "space-between",
							flexDirection: "column",
						}}>
						{this.props.isAuthenticated &&
							this.props.profile &&
							this.props.profile.displayName && (
								<View
									style={{
										paddingBottom: 20,
										justifyContent: "space-between",
										flexDirection: "row",
									}}>
									<View>
										<Text style={styles.displayName}>
											{this.props.profile.displayName}
										</Text>
										<Text style={styles.body}>
											Highscore:{" "}
											{this.props.profile.highscore}
										</Text>
									</View>
									{this.props.profile.photoURL && (
										<Image
											style={styles.picture}
											source={{
												uri: this.props.profile
													.photoURL,
											}}
										/>
									)}
								</View>
							)}
						{!this.props.isAuthenticated && (
							<View>
								<TextInput
									autoFocus
									style={{
										height: 40,
										marginTop: 15,
										marginBottom: 15,
										color: "#FFF",
									}}
									onChangeText={(value) =>
										this.setState({ phoneNumber: value })
									}
									placeholder={"Email"}
								/>
								<TextInput
									autoFocus
									style={{
										height: 40,
										marginTop: 15,
										marginBottom: 15,
										color: "#FFF",
									}}
									onChangeText={(value) =>
										this.setState({ phoneNumber: value })
									}
									placeholder={"Password"}
								/>
								<StyledButton
									title='Login'
									onPress={() =>
										this.props.login(
											this.state.email,
											this.state.password,
										)
									}
								/>
							</View>
						)}

						{!this.props.isAuthenticated && (
							<View>
								<TextInput
									autoFocus
									style={{
										height: 40,
										marginTop: 5,
										marginBottom: 5,
										color: "#FFF",
									}}
									placeholderTextColor='#FFF'
									onChangeText={(value) =>
										this.setState({ email: value })
									}
									placeholder={"Email"}
								/>
								<TextInput
									autoFocus
									style={{
										height: 40,
										marginTop: 5,
										marginBottom: 5,
										color: "#FFF",
									}}
									onChangeText={(value) =>
										this.setState({ password: value })
									}
									placeholderTextColor='#FFF'
									placeholder={"Password"}
								/>
								<StyledButton
									title='Sign Up'
									onPress={() =>
										this.props.signUp(
											this.state.email,
											this.state.password,
										)
									}
								/>
							</View>
						)}
						{this.props.isAuthenticated && (
							<StyledButton
								title='Logout'
								onPress={this.props.logout}
							/>
						)}
					</View>
				</View>
				<NavigationUI navigation={this.props.navigation} />
			</View>
		);
	}
}

export default connect(
	(state) => ({
		isAuthenticated: isAuthenticated(state),
		profile: profile(state),
		confirmResults: getPropertyFromState(state, "confirmResults"),
	}),
	Dispatchers,
)(ProfileScreen);
