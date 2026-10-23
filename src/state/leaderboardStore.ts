import { create } from "zustand";

import { watchLeaderboard } from "@/services/firebase";
import { sortLeaderboard, type LeaderboardEntry } from "@/services/highscoreMerge";

interface LeaderboardState {
	entries: LeaderboardEntry[];
	loaded: boolean;
	error: string | null;
	subscribe: () => () => void;
}

export const useLeaderboardStore = create<LeaderboardState>()((set) => ({
	entries: [],
	loaded: false,
	error: null,
	subscribe: () =>
		watchLeaderboard(
			(entries) => set({ entries: sortLeaderboard(entries), loaded: true, error: null }),
			(error) => set({ error: error.message, loaded: true }),
		),
}));
