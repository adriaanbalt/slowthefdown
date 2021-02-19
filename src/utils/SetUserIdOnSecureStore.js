import * as SecureStore from "expo-secure-store";
const SECURE_STORE_USER_UID = "ACCESS_TOKEN";
export default () => {
	return SecureStore.setItemAsync(SECURE_STORE_USER_UID, token);
};
