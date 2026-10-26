import * as Updates from "expo-updates";

export type LaunchUpdateStatus = "idle" | "checking" | "downloading" | "reloading";

/** True when expo-updates can fetch EAS Update bundles (release/preview builds). */
export function isUpdatesActive(): boolean {
	return !__DEV__ && Updates.isEnabled;
}

/**
 * Check for an OTA bundle on cold start. Downloads and reloads when available.
 * Fail-soft: logs and returns so the app can continue on the embedded bundle.
 */
export async function applyLaunchUpdate(onStatus?: (status: LaunchUpdateStatus) => void): Promise<void> {
	if (!isUpdatesActive()) return;

	try {
		onStatus?.("checking");
		const update = await Updates.checkForUpdateAsync();
		if (!update.isAvailable) {
			onStatus?.("idle");
			return;
		}
		onStatus?.("downloading");
		await Updates.fetchUpdateAsync();
		onStatus?.("reloading");
		await Updates.reloadAsync();
	} catch (error) {
		console.warn("Update check failed", error);
		onStatus?.("idle");
	}
}
