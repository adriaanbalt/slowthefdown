import { router } from "expo-router";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";

import PhoneAuth from "@/components/PhoneAuth";
import Colors from "@/constants/Colors";
import ButtonCircle from "@/shared/ButtonCircle";

export default function LoginPhoneModal() {
	const close = () => router.back();
	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<View style={styles.header}>
				<ButtonCircle
					iconName="close"
					accessibilityLabel="Close"
					backgroundColor={Colors.backgroundColor}
					iconStyle={{ paddingTop: 2 }}
					onPress={close}
				/>
			</View>
			<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
				<PhoneAuth onComplete={close} />
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	header: {
		alignItems: "center",
		paddingTop: 20,
	},
	content: {
		padding: 35,
	},
});
