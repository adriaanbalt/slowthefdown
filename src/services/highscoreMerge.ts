/** Highscores are stored as whole tenths of a second, as the old app did. */
export function parseHighscore(raw: unknown): number {
	const n = typeof raw === "number" ? raw : Number(raw);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export interface MergedHighscore {
	highscore: number;
	/** The device holds a better score than the server (e.g. earned offline). */
	pushToServer: boolean;
}

export function mergeHighscore(local: unknown, server: unknown): MergedHighscore {
	const l = parseHighscore(local);
	const s = parseHighscore(server);
	return { highscore: Math.max(l, s), pushToServer: l > s };
}

export function isNewBest(score: number, ...bests: unknown[]): boolean {
	const best = Math.max(0, ...bests.map(parseHighscore));
	return parseHighscore(score) > best;
}

export interface LeaderboardEntry {
	uid: string;
	displayName: string;
	highscore: number;
}

export function toLeaderboardEntry(
	uid: string,
	value: unknown,
	scoreKey: "highscore" | "focusHighscore" = "highscore",
): LeaderboardEntry {
	const v = (value ?? {}) as Record<string, unknown>;
	return {
		uid,
		displayName: typeof v.displayName === "string" ? v.displayName : "",
		highscore: parseHighscore(v[scoreKey]),
	};
}

export function sortLeaderboard(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
	return [...entries].sort((a, b) => b.highscore - a.highscore);
}
