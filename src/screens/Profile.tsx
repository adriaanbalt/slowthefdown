import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import ModeToggle from "@/components/ModeToggle";
import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import { formatStoredScore } from "@/game/format";
import Header from "@/shared/Header";
import StyledButton from "@/shared/StyledButton";
import { useSettingsStore } from "@/state/settingsStore";
import { useUserStore } from "@/state/userStore";

function ModeControls() {
	const defaultMode = useSettingsStore((s) => s.defaultMode);
	const sessionMode = useSettingsStore((s) => s.sessionMode);
	const setDefaultMode = useSettingsStore((s) => s.setDefaultMode);
	const setSessionMode = useSettingsStore((s) => s.setSessionMode);

	return (
		<View style={styles.modeBlock}>
			<ModeToggle
				label="Default when app opens"
				value={defaultMode}
				onChange={setDefaultMode}
			/>
			<ModeToggle label="Play mode now" value={sessionMode} onChange={setSessionMode} />
			<Text style={styles.hint}>
				Classic is the hold timer. Focus adds a meter, grace, and recoveries.
			</Text>
		</View>
	);
}

function SignedIn() {
	const displayName = useUserStore((s) => s.displayName);
	const highscore = useUserStore((s) => s.highscore);
	const focusHighscore = useUserStore((s) => s.focusHighscore);
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
				<ModeControls />
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
				<Text style={styles.text}>Classic best:</Text>
				<Text style={Styles.h1}>{formatStoredScore(highscore)}</Text>
				<Text style={styles.text}>Focus best:</Text>
				<Text style={Styles.h1}>{formatStoredScore(focusHighscore)}</Text>
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
	const focusHighscore = useUserStore((s) => s.focusHighscore);
	return (
		<>
			<ModeControls />
			<StyledButton title="Login / Signup" onPress={() => router.push("/login-phone")} />
			<Text style={styles.text}>
				{`Classic ${formatStoredScore(highscore)} · Focus ${formatStoredScore(focusHighscore)}. Sign up to post on the boards.`}
			</Text>
		</>
	);
}

export default function ProfileScreen() {
	const uid = useUserStore((s) => s.uid);
	return (
		<ScrollView style={Styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
			<Header style={{ paddingBottom: 0 }}>Profile</Header>
			{uid ? <SignedIn key={uid} /> : <SignedOut />}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	body: {
		justifyContent: "space-between",
		flexGrow: 1,
	},
	modeBlock: {
		marginTop: 12,
		marginBottom: 8,
	},
	hint: {
		color: Colors.grayColor,
		fontSize: 13,
		marginTop: 4,
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
