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
import firebaseApp from "../../constants/firebase";
import Styles from "../../constants/Styles";
import ButtonBubble from "../../shared/ButtonBubble";
import Input from "../../shared/Input";
import COLORS from "../../constants/Colors";
import CountrySelector from "./CountrySelector";
import PrivacyPolicyLink from "../PrivacyPolicyLink";

var { width, height } = Dimensions.get("window");

export default function App(props) {
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
	const firebaseConfig = firebaseApp.options;
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

	const format = (phoneNumberString) => {
		var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
		var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return match[1] + match[2] + match[3];
		}
	};

	return (
		<View>
			<FirebaseRecaptchaVerifierModal
				ref={recaptchaVerifier}
				firebaseConfig={firebaseConfig}
				attemptInvisibleVerification={true}
			/>
			{!verificationId && (
				<React.Fragment>
					<Text
						style={[
							Styles.h3,
							{ marginBottom: 0, textAlign: "center" },
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
							alignItems: "center",
							marginTop: 15,
							marginBottom: 15,
						}}>
						<CountrySelector
							style={{
								height: 50,
								justifyContent: "center",
								borderWidth: 1,
								borderColor: COLORS.buttonBorderColor,
								marginRight: 15,
								paddingLeft: 10,
								paddingRight: 10,
							}}
							selectedCountry={(countryCallingCode) =>
								setCountryCallingCode(countryCallingCode)
							}
						/>
						<View
							style={{
								borderBottomColor: "#fff",
								borderBottomWidth: 1,
								flexGrow: 1,
								justifyContent: "center",
							}}>
							<Input
								onChangeText={(phoneNumber) => {
									const n = phoneNumber.replace(
										/[^0-9]{0,10}$/g,
										"",
									);
									if (n.length <= 10) {
										setPhoneNumber(n);
										setPhoneNumberFormatted(n);
									}
								}}
								value={phoneNumberFormatted}
								placeholderTextColor='#aaa'
								placeholder='999 999 9999'
								autoCompleteType='tel'
								keyboardType='phone-pad'
								textContentType='telephoneNumber'
								style={{
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
									color: "#f00",
									fontSize: 17,
									textAlign: "center",
									marginTop: 20,
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
								marginTop: 5,
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
						style={[
							{
								marginTop: 25,
							},
						]}
						onPress={async () => {
							// The FirebaseRecaptchaVerifierModal ref implements the
							// FirebaseAuthApplicationVerifier interface and can be
							// passed directly to `verifyPhoneNumber`.
							try {
								if (!countryCallingCode) {
									throw new Error(
										`Please select your country code`,
									);
								}
								if (phoneNumber.length > 10) {
									throw new Error(
										`Invalid phone number. Too many digits`,
									);
								}
								if (phoneNumber.length < 10) {
									throw new Error(
										`Invalid phone number.  Not enough digits.`,
									);
								}
								const phoneNumberWithCallingCode = `+${
									countryCallingCode + phoneNumber
								}`;
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
						Request Verification Code
					</ButtonBubble>
				</React.Fragment>
			)}
			{phoneNumber !== undefined && verificationId && !credential && (
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
							marginTop: 25,
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
						Submit
					</ButtonBubble>
				</React.Fragment>
			)}
		</View>
	);
}
