import React from "react";
import { View } from "react-native";
import COLORS from "../../constants/Colors";
import PhoneAuth from "../../utils/PhoneAuth";

export default function Join(props) {
	return (
		<View
			style={{
				padding: 15,
			}}>
			<PhoneAuth
				onComplete={(user) => {
					props.setUserDataLocal(user);
					props.navigation.goBack();
				}}
				onboardingButtonStyle={{
					backgroundColor: COLORS.backgroundColor,
					fontColor: COLORS.fontColor,
				}}
			/>
		</View>
	);
}
