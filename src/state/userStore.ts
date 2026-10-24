import { create } from "zustand";

import {
	currentUid,
	fetchUser,
	logOut,
	updateUser,
	watchAuth,
	type User,
} from "@/services/firebase";
import { submitClassicScore, submitFocusScore } from "@/services/highscores";
import { mergeHighscore } from "@/services/highscoreMerge";
import {
	clearLegacyUid,
	readLocalFocusHighscore,
	readLocalHighscore,
	writeLocalFocusHighscore,
	writeLocalHighscore,
} from "@/services/localHighscore";

interface UserState {
	ready: boolean;
	uid: string | null;
	displayName: string | null;
	/** Classic best, tenths of a second. */
	highscore: number;
	/** Focus best, tenths of weighted focus time. */
	focusHighscore: number;
	/** Classic run in progress (or last), milliseconds. */
	currentRun: number;
	init: () => () => void;
	setCurrentRun: (ms: number) => void;
	recordRun: (ms: number) => Promise<void>;
	recordFocusScore: (tenths: number) => Promise<void>;
	saveDisplayName: (displayName: string) => Promise<void>;
	logout: () => Promise<void>;
}

function reportError(context: string) {
	return (error: unknown) => console.warn(context, error);
}

export const useUserStore = create<UserState>()((set, get) => {
	async function onSignedIn(user: User) {
		set({ uid: user.uid });
		const [localClassic, localFocus] = await Promise.all([
			readLocalHighscore(),
			readLocalFocusHighscore(),
		]);
		let record: Awaited<ReturnType<typeof fetchUser>>;
		try {
			record = await fetchUser(user.uid);
		} catch (error) {
			if (currentUid() === user.uid) {
				set({
					highscore: Math.max(localClassic, get().highscore),
					focusHighscore: Math.max(localFocus, get().focusHighscore),
					ready: true,
				});
			}
			throw error;
		}
		if (currentUid() !== user.uid) return;
		const classic = mergeHighscore(Math.max(localClassic, get().highscore), record?.highscore);
		const focus = mergeHighscore(
			Math.max(localFocus, get().focusHighscore),
			record?.focusHighscore,
		);
		set({
			uid: user.uid,
			displayName: record?.displayName ?? null,
			highscore: classic.highscore,
			focusHighscore: focus.highscore,
			ready: true,
		});
		await writeLocalHighscore(classic.highscore);
		await writeLocalFocusHighscore(focus.highscore);
		await updateUser(user.uid, {
			lastLoginAt: Date.now(),
			...(classic.pushToServer && { highscore: classic.highscore }),
			...(focus.pushToServer && { focusHighscore: focus.highscore }),
		});
	}

	async function onSignedOut() {
		const [localClassic, localFocus] = await Promise.all([
			readLocalHighscore(),
			readLocalFocusHighscore(),
		]);
		if (currentUid() !== null) return;
		set({
			uid: null,
			displayName: null,
			highscore: localClassic,
			focusHighscore: localFocus,
			ready: true,
		});
	}

	return {
		ready: false,
		uid: null,
		displayName: null,
		highscore: 0,
		focusHighscore: 0,
		currentRun: 0,

		init: () =>
			watchAuth((user) => {
				const work = user ? onSignedIn(user) : onSignedOut();
				work.catch(reportError("Failed to load user"));
			}),

		setCurrentRun: (ms) => {
			if (get().currentRun !== ms) set({ currentRun: ms });
		},

		recordRun: async (ms) => {
			const tenths = Math.ceil(Math.max(0, ms) / 100);
			try {
				const next = await submitClassicScore(tenths, get().uid, get().highscore);
				if (next !== null) set({ highscore: next });
			} catch (error) {
				reportError("Failed to post highscore")(error);
			}
		},

		recordFocusScore: async (tenths) => {
			try {
				const next = await submitFocusScore(tenths, get().uid, get().focusHighscore);
				if (next !== null) set({ focusHighscore: next });
			} catch (error) {
				reportError("Failed to post focus highscore")(error);
			}
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
			await writeLocalHighscore(0);
			await writeLocalFocusHighscore(0);
			set({
				uid: null,
				displayName: null,
				highscore: 0,
				focusHighscore: 0,
				currentRun: 0,
			});
			await logOut();
		},
	};
});
