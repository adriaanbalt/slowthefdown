import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

const styles = StyleSheet.create({
	text: {
		color: "#FFF",
		padding: 3,
		textAlign: "center",
		fontSize: 30,
	},
});

interface Props {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
}

export default function Header({ children, style }: Props) {
	return (
		<View style={style}>
			<Text style={styles.text}>{children}</Text>
		</View>
	);
}
