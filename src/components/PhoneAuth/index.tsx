import * as Linking from "expo-linking";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import { requestPhoneCode, type ConfirmationResult } from "@/services/firebase";
import ButtonBubble from "@/shared/ButtonBubble";
import Input from "@/shared/Input";

import CountrySelector from "./CountrySelector";

const PRIVACY_URL = "https://www.greatflix.app/privacy";
const MIN_DIGITS = 6;
const MAX_DIGITS = 14;

function describeError(error: unknown): string {
	const e = error as { code?: string; message?: string };
	switch (e.code) {
		case "auth/invalid-phone-number":
			return "That phone number doesn't look right.";
		case "auth/invalid-verification-code":
			return "That code is incorrect. Check the SMS and try again.";
		case "auth/too-many-requests":
			return "Too many attempts. Please wait a bit and try again.";
		case "auth/session-expired":
		case "auth/code-expired":
			return "That code expired. Request a new one.";
		default:
			return e.message ?? String(error);
	}
}

interface Props {
	onComplete: () => void;
}

export default function PhoneAuth({ onComplete }: Props) {
	const [callingCode, setCallingCode] = useState<string>();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
	const [code, setCode] = useState("");
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function requestCode() {
		setMessage(null);
		if (!callingCode) return setMessage("Please select your country code.");
		if (phoneNumber.length < MIN_DIGITS) return setMessage("Invalid phone number. Not enough digits.");
		if (phoneNumber.length > MAX_DIGITS) return setMessage("Invalid phone number. Too many digits.");
		setBusy(true);
		try {
			setConfirmation(await requestPhoneCode(`+${callingCode}${phoneNumber}`));
			setMessage("Verification code has been sent to your phone.");
		} catch (error) {
			setMessage(describeError(error));
		} finally {
			setBusy(false);
		}
	}

	async function submitCode() {
		if (!confirmation) return;
		setMessage(null);
		setBusy(true);
		try {
			await confirmation.confirm(code.trim());
			onComplete();
		} catch (error) {
			setMessage(describeError(error));
		} finally {
			setBusy(false);
		}
	}

	if (confirmation) {
		return (
			<View>
				<Text style={[Styles.h3, styles.center, { marginBottom: 5 }]}>Enter Verification code</Text>
				<Input
					onChangeText={(t) => setCode(t.replace(/\D/g, ""))}
					value={code}
					placeholderTextColor="#aaa"
					placeholder="123456"
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					autoComplete="sms-otp"
					maxLength={6}
					autoFocus
					style={{ marginTop: 5 }}
				/>
				{message && <Text style={styles.message}>{message}</Text>}
				{busy ? (
					<ActivityIndicator color={Colors.fontColor} style={{ marginTop: 25 }} />
				) : (
					<ButtonBubble style={{ marginTop: 25 }} onPress={submitCode} disabled={code.length < 6}>
						Submit
					</ButtonBubble>
				)}
				<TouchableOpacity
					onPress={() => {
						setConfirmation(null);
						setCode("");
						setMessage(null);
					}}>
					<Text style={[Styles.h6, styles.center, styles.link]}>Use a different number</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View>
			<Text style={[Styles.h3, styles.center]}>Enter your</Text>
			<Text style={[Styles.h3, styles.center, { marginBottom: 5 }]}>phone number</Text>
			<Text style={[Styles.h6, styles.center, { marginBottom: 5 }]}>
				We'll send you an SMS verification code.
			</Text>
			<View style={styles.phoneRow}>
				<CountrySelector style={styles.country} onSelectCallingCode={setCallingCode} />
				<View style={styles.phoneField}>
					<Input
						onChangeText={(t) => setPhoneNumber(t.replace(/\D/g, "").slice(0, MAX_DIGITS))}
						value={phoneNumber}
						placeholderTextColor="#aaa"
						placeholder="999 999 9999"
						autoComplete="tel"
						keyboardType="phone-pad"
						textContentType="telephoneNumber"
						style={{ marginTop: 5 }}
					/>
				</View>
			</View>
			{message && <Text style={styles.message}>{message}</Text>}
			<Text style={[Styles.h6, styles.center, Styles.italic, { marginTop: 5, marginBottom: 5 }]}>
				By continuing you agree to our
			</Text>
			<TouchableOpacity onPress={() => void Linking.openURL(PRIVACY_URL)}>
				<Text style={[Styles.h6, styles.center, Styles.italic, styles.link]}>Terms & Privacy Policy</Text>
			</TouchableOpacity>
			{busy ? (
				<ActivityIndicator color={Colors.fontColor} style={{ marginTop: 25 }} />
			) : (
				<ButtonBubble style={{ marginTop: 25 }} onPress={requestCode}>
					Request Verification Code
				</ButtonBubble>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	center: {
		textAlign: "center",
	},
	link: {
		marginBottom: 5,
		textDecorationLine: "underline",
	},
	phoneRow: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 15,
	},
	country: {
		height: 50,
		justifyContent: "center",
		borderWidth: 1,
		borderColor: Colors.buttonBorderColor,
		marginRight: 15,
		paddingHorizontal: 10,
	},
	phoneField: {
		borderBottomColor: "#fff",
		borderBottomWidth: 1,
		flexGrow: 1,
		flexShrink: 1,
		justifyContent: "center",
	},
	message: {
		color: Colors.red,
		fontSize: 17,
		textAlign: "center",
		marginTop: 20,
	},
});
