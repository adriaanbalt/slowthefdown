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
	Keyboard,
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
	getCurrentUserHighscore,
} from "../../redux/selectors";
import { Color } from "three";

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
		paddingBottom: 0,
	},

	h1: {
		color: Colors.fontColor,
		fontSize: 34,
		marginBottom: 10,
	},

	h2: {
		color: Colors.fontColor,
		fontSize: 24,
		marginBottom: 10,
	},

	howto: {
		textAlign: "center",
		color: Colors.fontColor,
		fontSize: 12,
		marginBottom: 10,
	},

	input: {
		height: 24,
		marginTop: 5,
		marginBottom: 5,
		color: Colors.fontColor,
		borderBottomColor: Colors.grayColor, // Add this to specify bottom border color
		borderBottomWidth: 1, // Add this to specify bottom border thickness
	},

	error: {
		color: Colors.red,
		fontSize: 14,
	},

	inputContainer: {
		borderBottomColor: Color.fontColor,
		borderBottomWidth: 3,
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

	submitBtn: {
		marginTop: 20,
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
			isLogin: false,
			isSignup: false,
		};
	}

	componentDidMount() {
		this.setState({ loading: true });
		// this.props
		// 	.login()
		// 	.then((user) => {
		// 		this.setState({ loading: false });
		// 	})
		// 	.catch(() => {
		// 		this.setState({ loading: false });
		// 	});
	}

	navigateToGame = () => {
		this.props.navigation.navigate("Game", {});
	};
	navigateToHighscores = () => {
		this.props.navigation.navigate("Highscores", {});
	};

	closeKeyboard = () => {
		Keyboard.dismiss();
		this.setState({
			isSignup: false,
			isLogin: false,
		});
	};

	revealLogin = () =>
		this.setState({
			isLogin: true,
			isSignup: false,
			error: null,
		});

	revealSignup = () =>
		this.setState({
			isLogin: false,
			isSignup: true,
			error: null,
		});

	login = async () => {
		const res = await this.props.login(
			this.state.email,
			this.state.password,
		);
		if (!res.user && res.message) {
			// error!
			this.setState({
				error: res.message,
			});
			console.log("this.state", this.state);
		} else {
			this.setState({
				error: null,
			});
		}
	};

	renderLogin = () => {
		return (
			<View>
				<Text style={styles.h2}>Login</Text>
				{this.renderInputs(true)}
				<StyledButton
					title='Submit'
					style={styles.submitBtn}
					onPress={this.login}
				/>
				<StyledButton
					title='Close keyboard'
					style={styles.submitBtn}
					onPress={this.closeKeyboard}
				/>
			</View>
		);
	};

	renderSignup = () => {
		return (
			<View>
				<Text style={styles.h2}>Signup</Text>
				<TextInput
					autoFocus
					style={styles.input}
					maxLength={20}
					onChangeText={(value) =>
						this.setState({ displayName: value })
					}
					placeholder={"Your Name"}
					placeholderTextColor={Colors.fontColor}
				/>
				{this.renderInputs(false)}
				<StyledButton
					title='Submit'
					style={styles.submitBtn}
					onPress={() =>
						this.props.signUp(
							this.state.email,
							this.state.password,
							this.state.displayName,
						)
					}
				/>
				<StyledButton
					title='Close keyboard'
					style={styles.submitBtn}
					onPress={this.closeKeyboard}
				/>
			</View>
		);
	};

	renderInputs = (focusEmail) => {
		return (
			<View>
				<View style={styles.inputContainer}>
					<TextInput
						autoFocus={focusEmail}
						style={styles.input}
						onChangeText={(value) =>
							this.setState({ email: value })
						}
						ref={(input) => {
							this.emailTextInput = input;
						}}
						placeholder={"Email"}
						placeholderTextColor={Colors.fontColor}
					/>
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						onChangeText={(value) =>
							this.setState({ password: value })
						}
						secureTextEntry={true}
						placeholder={"Password"}
						placeholderTextColor={Colors.fontColor}
					/>
				</View>
			</View>
		);
	};

	renderProfile = () => {
		return (
			<View
				style={{
					paddingBottom: 20,
					justifyContent: "space-between",
					flexDirection: "column",
				}}>
				<View>
					<Text style={styles.displayName}>
						{this.props.user.displayName}
					</Text>
					<Text style={styles.displayName}>
						{this.props.user.email}
					</Text>
					<Text style={styles.body}>
						How long you slowed the F down:
					</Text>
					<Text style={styles.h1}>{this.props.user.highscore}</Text>
				</View>
				{this.props.user.photoURL && (
					<Image
						style={styles.picture}
						source={{
							uri: this.props.user.photoURL,
						}}
					/>
				)}
				<StyledButton title='Logout' onPress={this.props.logout} />
			</View>
		);
	};

	render() {
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
						{this.props.isAuthenticated && this.renderProfile()}
						{!this.props.isAuthenticated && (
							<Text style={styles.h1}>
								{`To post your time of ${this.props.highscore} on the score board, sign up or login below`}
							</Text>
						)}
						{!this.props.isAuthenticated &&
							!this.state.isLogin &&
							!this.state.isSignup && (
								<View>
									<StyledButton
										title='Login'
										onPress={this.revealLogin}
									/>
									<StyledButton
										title='Sign Up'
										onPress={this.revealSignup}
									/>
								</View>
							)}
						{!this.props.isAuthenticated &&
							this.state.isLogin &&
							!this.state.isSignup && (
								<StyledButton
									title='Sign Up'
									onPress={this.revealSignup}
								/>
							)}

						{!this.props.isAuthenticated &&
							!this.state.isLogin &&
							this.state.isSignup && (
								<StyledButton
									title='Login'
									onPress={this.revealLogin}
								/>
							)}
						{!this.props.isAuthenticated &&
							this.state.isLogin &&
							this.renderLogin()}
						{!this.props.isAuthenticated &&
							this.state.isSignup &&
							this.renderSignup()}
						{this.state.error && (
							<Text style={styles.error}>{this.state.error}</Text>
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
		user: profile(state),
		highscore: getCurrentUserHighscore(state),
		confirmResults: getPropertyFromState(state, "confirmResults"),
	}),
	Dispatchers,
)(ProfileScreen);
