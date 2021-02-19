import * as SecureStore from "expo-secure-store";
const SECURE_STORE_HIGHSCORE = "SECURE_STORE_HIGHSCORE";
export default () => {
	return SecureStore.getItemAsync(SECURE_STORE_HIGHSCORE).then((res) => {
		return Number(res) || 0;
	});
};
