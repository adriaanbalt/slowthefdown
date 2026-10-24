import { create } from "zustand";

import { watchFocusLeaderboard, watchLeaderboard } from "@/services/firebase";
import { sortLeaderboard, type LeaderboardEntry } from "@/services/highscoreMerge";

interface LeaderboardState {
	classic: LeaderboardEntry[];
	focus: LeaderboardEntry[];
	classicLoaded: boolean;
	focusLoaded: boolean;
	error: string | null;
	subscribe: () => () => void;
}

export const useLeaderboardStore = create<LeaderboardState>()((set) => ({
	classic: [],
	focus: [],
	classicLoaded: false,
	focusLoaded: false,
	error: null,
	subscribe: () => {
		const stopClassic = watchLeaderboard(
			(entries) =>
				set({ classic: sortLeaderboard(entries), classicLoaded: true, error: null }),
			(error) => set({ error: error.message, classicLoaded: true }),
		);
		const stopFocus = watchFocusLeaderboard(
			(entries) => set({ focus: sortLeaderboard(entries), focusLoaded: true, error: null }),
			(error) => set({ error: error.message, focusLoaded: true }),
		);
		return () => {
			stopClassic();
			stopFocus();
		};
	},
}));
