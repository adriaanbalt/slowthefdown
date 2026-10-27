export const APP_STORE_ID = "1488685198";

const LOOKUP_URL = `https://itunes.apple.com/lookup?id=${APP_STORE_ID}`;
const FALLBACK_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;

export type AppStoreUpdate = {
	version: string;
	url: string;
};

/** Compares dotted numeric versions ("10.0.3"). Missing parts count as 0. Returns >0 when a is newer than b. */
export function compareVersions(a: string, b: string): number {
	const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
	const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
	const len = Math.max(pa.length, pb.length);
	for (let i = 0; i < len; i++) {
		const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
		if (diff !== 0) return diff;
	}
	return 0;
}

export function isStoreNewer(installed: string, store: string): boolean {
	return compareVersions(store, installed) > 0;
}

type LookupResponse = { results?: { version?: string; trackViewUrl?: string }[] };

/**
 * Ask the App Store whether a newer binary than `installed` is live.
 * `installed` is the native binary version (not the OTA bundle) — OTA only reaches builds with a matching runtimeVersion.
 * Fail-soft: network or parse errors log and resolve null so launch is never blocked.
 */
export async function fetchAppStoreUpdate(installed: string): Promise<AppStoreUpdate | null> {
	try {
		const res = await fetch(LOOKUP_URL);
		const body = (await res.json()) as LookupResponse;
		const entry = body.results?.[0];
		if (!entry?.version || !isStoreNewer(installed, entry.version)) return null;
		return { version: entry.version, url: entry.trackViewUrl ?? FALLBACK_STORE_URL };
	} catch (error) {
		console.warn("App Store version check failed", error);
		return null;
	}
}
