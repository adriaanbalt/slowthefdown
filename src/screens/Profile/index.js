import React from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import Dispatchers from "../../redux/dispatchers";
import StyledButton from "../../shared/StyledButton";
import Colors from "../../constants/Colors";
import Header from "../../shared/Header";
import {
	isAuthenticated,
	profile,
	getCurrentUserHighscore,
} from "../../redux/selectors";
import Styles from "../../constants/Styles";
import Input from "../../shared/Input";

const styles = StyleSheet.create({
	header: {
		paddingBottom: 0,
	},

	input: {
		height: 24,
		marginTop: 5,
		marginBottom: 5,
		color: Colors.fontColor,
		borderBottomColor: Colors.grayColor, // Add this to specify bottom border color
		borderBottomWidth: 1, // Add this to specify bottom border thickness
	},

	displayNameContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
	},

	displayNameLabel: {
		color: Colors.fontColor,
		fontSize: 25,
		marginRight: 5,
	},
	displayNameInput: {
		color: Colors.fontColor,
		fontSize: 25,
		paddingBottom: 5,
	},

	body: {
		paddingTop: 10,
		paddingBottom: 10,
		color: Colors.fontColor,
		fontSize: 20,
	},
});

class ProfileScreen extends React.Component {
	gotoLogin = () => this.props.navigation.navigate("ModalLoginPhone");

	save = () => {
		this.props.save();
	};
	renderProfile = () => {
		return (
			<View
				style={{
					justifyContent: "space-between",
					flexDirection: "column",
					flexGrow: 1,
				}}>
				<View
					style={{
						flexGrow: 1,
					}}>
					<View style={styles.displayNameContainer}>
						<Text style={styles.displayNameLabel}>{`Name:`}</Text>
						<View
							style={{
								borderBottomWidth: 1,
								borderBottomColor: "#fff",
								flexGrow: 1,
							}}>
							<Input
								placeholder='Update your name'
								style={styles.displayNameInput}
							/>
						</View>
					</View>
					<Text style={styles.body}>
						How long you slowed the F down:
					</Text>
					<Text style={Styles.h1}>{this.props.user.highscore}</Text>
				</View>
				<View>
					<StyledButton title='Save' onPress={this.save} />
					<StyledButton title='Logout' onPress={this.props.logout} />
				</View>
			</View>
		);
	};

	render() {
		return (
			<View style={Styles.container}>
				<Header style={styles.header}>Profile</Header>
				{this.props.isAuthenticated && this.renderProfile()}
				{!this.props.isAuthenticated && (
					<React.Fragment>
						<StyledButton
							title='Login / Signup'
							onPress={this.gotoLogin}
						/>
						<Text style={styles.h1}>
							{`To post your time of ${this.props.highscore} on the score board, sign up or login below`}
						</Text>
					</React.Fragment>
				)}
			</View>
		);
	}
}

export default connect(
	(state) => ({
		isAuthenticated: isAuthenticated(state),
		user: profile(state),
		highscore: getCurrentUserHighscore(state),
	}),
	Dispatchers,
)(ProfileScreen);
