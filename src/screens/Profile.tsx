import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import { formatFocusTime } from "@/game/format";
import Header from "@/shared/Header";
import StyledButton from "@/shared/StyledButton";
import { useUserStore } from "@/state/userStore";

function SignedIn() {
	const displayName = useUserStore((s) => s.displayName);
	const highscore = useUserStore((s) => s.highscore);
	const saveDisplayName = useUserStore((s) => s.saveDisplayName);
	const logout = useUserStore((s) => s.logout);
	const [edited, setName] = useState<string | null>(null);
	const name = edited ?? displayName ?? "";
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function save() {
		setSaving(true);
		setMessage(null);
		try {
			await saveDisplayName(name);
			setMessage("Saved");
		} catch (error) {
			setMessage(`Could not save: ${String(error)}`);
		} finally {
			setSaving(false);
		}
	}

	return (
		<View style={styles.body}>
			<View style={{ flexGrow: 1 }}>
				<View style={styles.nameRow}>
					<Text style={styles.nameLabel}>Name:</Text>
					<View style={styles.nameField}>
						<TextInput
							value={name}
							onChangeText={setName}
							placeholder="Update your name"
							placeholderTextColor={Colors.grayColor}
							maxLength={40}
							autoCorrect={false}
							returnKeyType="done"
							onSubmitEditing={save}
							style={styles.nameInput}
						/>
					</View>
				</View>
				{message && <Text style={styles.message}>{message}</Text>}
				<Text style={styles.text}>How long you slowed the F down:</Text>
				<Text style={Styles.h1}>{formatFocusTime(highscore)}</Text>
			</View>
			<View>
				<StyledButton title="Save" onPress={save} disabled={saving || !name.trim()} />
				<StyledButton title="Logout" onPress={() => void logout()} />
			</View>
		</View>
	);
}

function SignedOut() {
	const highscore = useUserStore((s) => s.highscore);
	return (
		<>
			<StyledButton title="Login / Signup" onPress={() => router.push("/login-phone")} />
			<Text style={styles.text}>
				{`To post your time of ${formatFocusTime(highscore)} on the score board, sign up or login above`}
			</Text>
		</>
	);
}

export default function ProfileScreen() {
	const uid = useUserStore((s) => s.uid);
	return (
		<View style={Styles.container}>
			<Header style={{ paddingBottom: 0 }}>Profile</Header>
			{uid ? <SignedIn key={uid} /> : <SignedOut />}
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		justifyContent: "space-between",
		flexGrow: 1,
	},
	nameRow: {
		width: "100%",
		flexDirection: "row",
	},
	nameLabel: {
		color: Colors.fontColor,
		fontSize: 25,
		marginRight: 5,
	},
	nameField: {
		borderBottomWidth: 1,
		borderBottomColor: "#fff",
		flexGrow: 1,
	},
	nameInput: {
		color: Colors.fontColor,
		fontSize: 25,
		paddingBottom: 5,
	},
	message: {
		color: Colors.grayColor,
		paddingTop: 6,
	},
	text: {
		paddingVertical: 10,
		color: Colors.fontColor,
		fontSize: 20,
	},
});
