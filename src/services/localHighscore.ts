import * as SecureStore from "expo-secure-store";

import { parseHighscore } from "./highscoreMerge";

// Key names are inherited from the SDK 39 app so existing installs keep their best score.
const HIGHSCORE_KEY = "SECURE_STORE_HIGHSCORE";
const FOCUS_HIGHSCORE_KEY = "SECURE_STORE_FOCUS_HIGHSCORE";
const LEGACY_UID_KEY = "ACCESS_TOKEN";

export async function readLocalHighscore(): Promise<number> {
	try {
		return parseHighscore(await SecureStore.getItemAsync(HIGHSCORE_KEY));
	} catch (error) {
		console.warn("Could not read local highscore", error);
		return 0;
	}
}

export async function writeLocalHighscore(tenths: number): Promise<void> {
	try {
		await SecureStore.setItemAsync(HIGHSCORE_KEY, String(parseHighscore(tenths)));
	} catch (error) {
		console.warn("Could not save local highscore", error);
	}
}

export async function readLocalFocusHighscore(): Promise<number> {
	try {
		return parseHighscore(await SecureStore.getItemAsync(FOCUS_HIGHSCORE_KEY));
	} catch (error) {
		console.warn("Could not read local focus highscore", error);
		return 0;
	}
}

export async function writeLocalFocusHighscore(tenths: number): Promise<void> {
	try {
		await SecureStore.setItemAsync(FOCUS_HIGHSCORE_KEY, String(parseHighscore(tenths)));
	} catch (error) {
		console.warn("Could not save local focus highscore", error);
	}
}

export async function clearLegacyUid(): Promise<void> {
	try {
		await SecureStore.deleteItemAsync(LEGACY_UID_KEY);
	} catch {
		// nothing stored
	}
}
