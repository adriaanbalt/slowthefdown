import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import type { LaunchUpdateStatus } from "@/services/updates";

type Props = {
	status: LaunchUpdateStatus;
};

export default function Loader({ status }: Props) {
	const visible = status === "downloading" || status === "reloading";
	if (!visible) return null;

	return (
		<View style={styles.container}>
			<View style={styles.modal}>
				<Text style={styles.h1}>There is an app update!</Text>
				<Text style={styles.text1}>The app will reload</Text>
				<Text style={styles.text2}>and you'll be all set.</Text>
				<ActivityIndicator color="#fff" size="large" />
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
		height: "50%",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		borderColor: "#FFF",
		borderWidth: 1,
		padding: 20,
		justifyContent: "center",
	},
	text1: {
		color: "#fff",
		textAlign: "center",
		marginBottom: 5,
		fontSize: 15,
	},
	text2: {
		color: "#fff",
		textAlign: "center",
		marginBottom: 25,
		fontSize: 15,
	},
	h1: {
		fontWeight: "bold",
		color: "#fff",
		textAlign: "center",
		marginBottom: 25,
		fontSize: 20,
	},
});
