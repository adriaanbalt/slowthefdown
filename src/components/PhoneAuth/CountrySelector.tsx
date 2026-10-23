import CountryPicker, { type CountryCode, type Theme } from "react-native-country-picker-modal";
import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import Colors from "@/constants/Colors";

const THEME: Theme = {
	activeOpacity: 0.5,
	backgroundColor: Colors.backgroundColor,
	filterPlaceholderTextColor: Colors.grayColor,
	flagSize: 30,
	flagSizeButton: 30,
	fontFamily: "System",
	fontSize: 16,
	itemHeight: 50,
	onBackgroundTextColor: "#fff",
	primaryColor: "#222",
	primaryColorVariant: "#444",
	keyboardAppearance: "dark",
};

interface Props {
	onSelectCallingCode: (callingCode: string) => void;
	style?: StyleProp<ViewStyle>;
}

export default function CountrySelector({ onSelectCallingCode, style }: Props) {
	const [countryCode, setCountryCode] = useState<CountryCode>();
	return (
		<CountryPicker
			theme={THEME}
			containerButtonStyle={style}
			countryCode={countryCode}
			withCallingCodeButton
			withFilter
			withFlag
			withCallingCode
			withModal
			preferredCountries={["US"]}
			onSelect={(country) => {
				const callingCode = country.callingCode[0];
				if (callingCode) onSelectCallingCode(callingCode);
				setCountryCode(country.cca2);
			}}
		/>
	);
}
