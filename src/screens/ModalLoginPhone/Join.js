import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import Dispatchers from "../../redux/dispatchers";
import COLORS from "../../constants/Colors";
import PhoneAuth from "../../utils/PhoneAuth";

const styles = StyleSheet.create({
	container: {
		padding: 15,
	},
});

class Join extends React.Component {
	mount = false;
	state = {
		error: null,
	};

	signUpAuth = (user) => {
		this.props.navigation.goBack();
	};

	render() {
		const { style } = this.props;

		return (
			<View style={[style, styles.container]}>
				<PhoneAuth
					onComplete={this.signUpAuth}
					onboardingButtonStyle={{
						backgroundColor: COLORS.backgroundColor,
						fontColor: COLORS.fontColor,
					}}
				/>
			</View>
		);
	}
}

export default connect(null, Dispatchers)(Join);
