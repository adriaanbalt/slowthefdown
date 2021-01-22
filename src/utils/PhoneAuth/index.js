import * as React from "react";
import {
	Text,
	View,
	Dimensions,
	TouchableOpacity,
	Platform,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import * as Linking from "expo-linking";
import Styles from "../../constants/Styles";
import ButtonBubble from "../../shared/ButtonBubble";
import Input from "../../shared/Input";
import COLORS from "../../constants/Colors";
import CountrySelector from "./CountrySelector";
import PrivacyPolicyLink from "../PrivacyPolicyLink";
import Colors from "../../constants/Colors";

var { width } = Dimensions.get("window");

export default function PhoneAuth(props) {
	const recaptchaVerifier = React.useRef(null);
	const [phoneNumber, setPhoneNumber] = React.useState();
	const [
		phoneNumberWithCountryCode,
		setPhoneNumberWithCountryCode,
	] = React.useState();
	const [phoneNumberFormatted, setPhoneNumberFormatted] = React.useState();
	const [countryCallingCode, setCountryCallingCode] = React.useState();
	const [verificationId, setVerificationId] = React.useState();
	const [verificationCode, setVerificationCode] = React.useState();
	const [credential, setCredential] = React.useState();
	const firebaseConfig = firebase.apps.length
		? firebase.app().options
		: undefined;
	const [message, showMessage] = React.useState(
		!firebaseConfig || Platform.OS === "web"
			? {
					text:
						"To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
			  }
			: undefined,
	);
	const [
		verificationCodeErrorMessage,
		showVerificationCodeErrorMessage,
	] = React.useState(
		!firebaseConfig || Platform.OS === "web"
			? {
					text:
						"To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
			  }
			: undefined,
	);

	const { onboarding, onboardingButtonStyle } = props;

	const format = (str) => {
		// clear our formatting characters
		str = str.replace(/\D/g, "");
		// re build the string formatted
		return buildFormattedString(str);
	};

	const buildFormattedString = (str) => {
		let returnStr = ""; // this is the string we will be building
		const lengthOfStr = str.length > 9 ? 10 : str.length;
		for (let index = 0; index < lengthOfStr; index++) {
			let char = str[index];
			// console.log('str', char, index)
			returnStr += `${char}`;
		}
		return returnStr;
	};

	const gotoPrivacy = () => {
		try {
			const url = "https://www.greatflix.app/privacy";
			Linking.canOpenURL(url).then((supported) => {
				if (supported) {
					Linking.openURL(url);
				}
			});
		} catch (err) {
			console.log("Privacy Policy onPress 'Linking' Error");
		}
	};

	return (
		<View style={{ marginTop: 20 }}>
			<FirebaseRecaptchaVerifierModal
				ref={recaptchaVerifier}
				firebaseConfig={firebaseConfig}
				attemptInvisibleVerification={true}
			/>
			{!verificationId && (
				<View style={{}}>
					<Text
						style={[
							Styles.h3,
							{ marginBottom: -5, textAlign: "center" },
						]}>
						Enter your
					</Text>
					<Text
						style={[
							Styles.h3,
							{ marginBottom: 5, textAlign: "center" },
						]}>
						phone number
					</Text>
					<Text
						style={[
							Styles.h6,
							{ marginBottom: 5, textAlign: "center" },
						]}>
						We'll send you an SMS verification code.
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							marginTop: 40,
						}}>
						<CountrySelector
							style={{
								height: 50,
								justifyContent: "center",
								borderBottomWidth: 1,
								borderBottomColor: "#fff",
								marginRight: 5,
							}}
							selectedCountry={(countryCallingCode) =>
								setCountryCallingCode(countryCallingCode)
							}
						/>
						<View
							style={{
								borderBottomWidth: 1,
								borderBottomColor: "#fff",
								flexGrow: 1,
								justifyContent: "center",
							}}>
							<Input
								onChangeText={(phoneNumber) => {
									setPhoneNumberFormatted(
										format(phoneNumber),
									);
									setPhoneNumber(phoneNumber);
								}}
								value={phoneNumberFormatted}
								placeholderTextColor='#aaa'
								placeholder='999 999 9999'
								autoCompleteType='tel'
								keyboardType='phone-pad'
								textContentType='telephoneNumber'
								style={{
									color: Colors.fontColor,
									fontSize: 20,
									marginTop: 5,
								}}
							/>
						</View>
					</View>
					{message && (
						<TouchableOpacity
							style={{ justifyContent: "center", zIndex: 100 }}
							onPress={() => showMessage(undefined)}>
							<Text
								style={{
									color: "#000",
									fontSize: 17,
									textAlign: "center",
									margin: 20,
								}}>
								{message.text}
							</Text>
						</TouchableOpacity>
					)}
					<Text
						style={[
							Styles.h6,
							{
								alignSelf: "center",
								marginTop: 65,
								marginBottom: 5,
								textAlign: "center",
								width: width,
								fontStyle: "italic",
							},
						]}>
						By continuing you agree to our
					</Text>
					<TouchableOpacity
						style={{ justifyContent: "center", zIndex: 100 }}
						onPress={PrivacyPolicyLink}>
						<Text
							style={[
								Styles.h6,
								{
									alignSelf: "center",
									marginBottom: 5,
									textAlign: "center",
									width: width / 2,
									fontStyle: "italic",
								},
							]}>
							Terms & Privacy Policy
						</Text>
					</TouchableOpacity>
					<ButtonBubble
						style={{
							marginTop: 25,
							backgroundColor: COLORS.grayColor,
						}}
						onPress={async () => {
							// The FirebaseRecaptchaVerifierModal ref implements the
							// FirebaseAuthApplicationVerifier interface and can be
							// passed directly to `verifyPhoneNumber`.
							try {
								const phoneNumberWithCallingCode = `+${
									countryCallingCode + phoneNumber
								}`;
								console.log(
									"phoneNumberWithCallingCode",
									phoneNumberWithCallingCode,
								);
								const phoneProvider = new firebase.auth.PhoneAuthProvider();
								const verificationId = await phoneProvider.verifyPhoneNumber(
									phoneNumberWithCallingCode,
									recaptchaVerifier.current,
								);
								setVerificationId(verificationId);
								showMessage({
									text:
										"Verification code has been sent to your phone.",
								});
							} catch (err) {
								showMessage({ text: `${err}` });
							}
						}}>
						<Text
							style={[
								Styles.italic,
								{ color: COLORS.fontColor, fontWeight: "bold" },
							]}>
							Request Verification Code
						</Text>
					</ButtonBubble>
				</View>
			)}
			{phoneNumber && verificationId && !credential && (
				<React.Fragment>
					<Text
						style={[
							Styles.h3,
							{ marginBottom: 5, textAlign: "center" },
						]}>
						Enter Verification code
					</Text>
					<Input
						onChangeText={setVerificationCode}
						placeholderTextColor='#aaa'
						placeholder='123456'
						autoCompleteType='tel'
						keyboardType='phone-pad'
						textContentType='telephoneNumber'
						style={{
							marginTop: 5,
						}}
					/>
					{verificationCodeErrorMessage && (
						<TouchableOpacity
							style={{ justifyContent: "center", zIndex: 100 }}
							onPress={() =>
								showVerificationCodeErrorMessage(undefined)
							}>
							<Text
								style={{
									color: "#000",
									fontSize: 17,
									textAlign: "center",
									margin: 20,
								}}>
								{verificationCodeErrorMessage.text}
							</Text>
						</TouchableOpacity>
					)}
					<ButtonBubble
						style={{
							marginTop: 55,
							backgroundColor: COLORS.grayColor,
						}}
						onPress={async () => {
							try {
								const credential = firebase.auth.PhoneAuthProvider.credential(
									verificationId,
									verificationCode,
								);
								const {
									user,
								} = await firebase
									.auth()
									.signInWithCredential(credential);
								// update user profile json files
								props.onComplete(user);
							} catch (err) {
								showVerificationCodeErrorMessage({
									text: `${err}`,
								});
								throw new Error(err);
							}
						}}>
						<Text
							style={[
								Styles.italic,
								{ color: "#000", fontWeight: "bold" },
							]}>
							Send Verification Code
						</Text>
					</ButtonBubble>
				</React.Fragment>
			)}
		</View>
	);
}
