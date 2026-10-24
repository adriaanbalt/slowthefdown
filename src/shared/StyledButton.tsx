import { Button, View } from "react-native";

import Colors from "@/constants/Colors";

interface Props {
	title: string;
	onPress: () => void;
	disabled?: boolean;
}

export default function StyledButton({ title, onPress, disabled }: Props) {
	return (
		<View style={{ borderWidth: 1, marginBottom: 10, borderColor: Colors.fontColor }}>
			<Button title={title} onPress={onPress} disabled={disabled} color={Colors.fontColor} />
		</View>
	);
}
