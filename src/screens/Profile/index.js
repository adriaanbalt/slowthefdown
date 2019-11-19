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
		paddingBottom: 20,
	},

	h2: {
		color: Colors.fontColor,
		fontSize: 24,
	},

	input: {
		height: 24,
		marginTop: 5,
		marginBottom: 5,
		color: Colors.fontColor,
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
			isLogin: false,
			isSignup: false,
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

	revealLogin = () =>
		this.setState({
			isLogin: true,
			isSignup: false,
		});

	revealSignup = () =>
		this.setState({
			isLogin: false,
			isSignup: true,
		});

	renderLogin = () => {
		return (
			<View>
				<Text style={styles.h2}>Login</Text>
				{this.renderInputs()}
				<StyledButton
					title='Submit'
					onPress={() =>
						this.props.login(this.state.email, this.state.password)
					}
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
					onChangeText={(value) =>
						this.setState({ displayName: value })
					}
					placeholder={"Your Name"}
					placeholderTextColor={Colors.fontColor}
				/>
				{this.renderInputs()}
				<StyledButton
					title='Submit'
					onPress={() =>
						this.props.signUp(
							this.state.email,
							this.state.password,
							this.state.displayName,
						)
					}
				/>
			</View>
		);
	};

	renderInputs = () => {
		return (
			<View>
				<View style={styles.inputContainer}>
					<TextInput
						autoFocus
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
						{this.props.profile.displayName}
					</Text>
					<Text style={styles.body}>
						Highscore: {this.props.profile.highscore}
					</Text>
				</View>
				{this.props.profile.photoURL && (
					<Image
						style={styles.picture}
						source={{
							uri: this.props.profile.photoURL,
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
							this.renderLogin()}
						{!this.props.isAuthenticated &&
							this.state.isSignup &&
							this.renderSignup()}
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
