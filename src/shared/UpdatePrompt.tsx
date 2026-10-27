import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";
import StyledButton from "@/shared/StyledButton";

type Props = {
	visible: boolean;
	title: string;
	message: string;
	actionLabel: string;
	dismissLabel: string;
	onAction: () => void;
	onDismiss: () => void;
};

/** Presentational two-button prompt. Knows nothing about versions or the App Store. */
export default function UpdatePrompt({ visible, title, message, actionLabel, dismissLabel, onAction, onDismiss }: Props) {
	if (!visible) return null;

	return (
		<View style={styles.container}>
			<View style={styles.modal}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.message}>{message}</Text>
				<StyledButton title={actionLabel} onPress={onAction} />
				<StyledButton title={dismissLabel} onPress={onDismiss} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFill,
		zIndex: 1000,
		justifyContent: "center",
		alignItems: "center",
	},
	modal: {
		width: "75%",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		borderColor: Colors.fontColor,
		borderWidth: 1,
		padding: 20,
		justifyContent: "center",
	},
	title: {
		fontWeight: "bold",
		color: Colors.fontColor,
		textAlign: "center",
		marginBottom: 15,
		fontSize: 20,
	},
	message: {
		color: Colors.fontColor,
		textAlign: "center",
		marginBottom: 25,
		fontSize: 15,
	},
});
