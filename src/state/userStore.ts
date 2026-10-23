import { create } from "zustand";

import {
	currentUid,
	fetchUser,
	logOut,
	updateUser,
	watchAuth,
	type User,
} from "@/services/firebase";
import { isNewBest, mergeHighscore } from "@/services/highscoreMerge";
import { clearLegacyUid, readLocalHighscore, writeLocalHighscore } from "@/services/localHighscore";

interface UserState {
	ready: boolean;
	uid: string | null;
	displayName: string | null;
	/** Best run, in tenths of a second. */
	highscore: number;
	/** The run in progress (or the last one), in tenths of a second. */
	currentRun: number;
	init: () => () => void;
	setCurrentRun: (tenths: number) => void;
	recordRun: (tenths: number) => Promise<void>;
	saveDisplayName: (displayName: string) => Promise<void>;
	logout: () => Promise<void>;
}

function reportError(context: string) {
	return (error: unknown) => console.warn(context, error);
}

export const useUserStore = create<UserState>()((set, get) => {
	async function onSignedIn(user: User) {
		set({ uid: user.uid });
		const local = await readLocalHighscore();
		let record: Awaited<ReturnType<typeof fetchUser>>;
		try {
			record = await fetchUser(user.uid);
		} catch (error) {
			// Offline with a cached session: play on the device best and merge on the next launch.
			if (currentUid() === user.uid) set({ highscore: Math.max(local, get().highscore), ready: true });
			throw error;
		}
		if (currentUid() !== user.uid) return;
		const merged = mergeHighscore(Math.max(local, get().highscore), record?.highscore);
		set({ uid: user.uid, displayName: record?.displayName ?? null, highscore: merged.highscore, ready: true });
		await writeLocalHighscore(merged.highscore);
		await updateUser(user.uid, {
			lastLoginAt: Date.now(),
			...(merged.pushToServer && { highscore: merged.highscore }),
		});
	}

	async function onSignedOut() {
		const local = await readLocalHighscore();
		if (currentUid() !== null) return;
		set({ uid: null, displayName: null, highscore: local, ready: true });
	}

	return {
		ready: false,
		uid: null,
		displayName: null,
		highscore: 0,
		currentRun: 0,

		init: () =>
			watchAuth((user) => {
				const work = user ? onSignedIn(user) : onSignedOut();
				work.catch(reportError("Failed to load user"));
			}),

		setCurrentRun: (tenths) => {
			if (get().currentRun !== tenths) set({ currentRun: tenths });
		},

		recordRun: async (tenths) => {
			const local = await readLocalHighscore();
			if (!isNewBest(tenths, local, get().highscore)) return;
			set({ highscore: tenths });
			await writeLocalHighscore(tenths);
			const uid = get().uid;
			if (uid) await updateUser(uid, { highscore: tenths }).catch(reportError("Failed to post highscore"));
		},

		saveDisplayName: async (displayName) => {
			const uid = get().uid;
			const trimmed = displayName.trim();
			if (!uid || !trimmed) return;
			await updateUser(uid, { displayName: trimmed });
			set({ displayName: trimmed });
		},

		logout: async () => {
			await clearLegacyUid();
			// The old app reset the device best on logout so the next person starts at 0.
			await writeLocalHighscore(0);
			set({ uid: null, displayName: null, highscore: 0, currentRun: 0 });
			await logOut();
		},
	};
});
