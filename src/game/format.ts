const pad = (n: number, width = 2) => String(n).padStart(width, "0");

/** Live HUD and scores: HH:MM:SS.mmm, always zero-padded. */
export function formatTimerMs(ms: number): string {
	const total = Math.max(0, Math.floor(ms));
	const hours = Math.floor(total / 3_600_000);
	const minutes = Math.floor((total % 3_600_000) / 60_000);
	const seconds = Math.floor((total % 60_000) / 1000);
	const millis = total % 1000;
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`;
}

/**
 * Leaderboard / profile / best. Stored scores are tenths of a second, so the
 * last two millisecond digits are always zero.
 */
export function formatStoredScore(tenths: number): string {
	return formatTimerMs(Math.max(0, Math.floor(tenths)) * 100);
}

/** @deprecated Prefer formatTimerMs / formatStoredScore. Kept for focus-meter tests. */
export function formatFocusTime(tenths: number): string {
	const total = Math.max(0, Math.floor(tenths));
	const minutes = Math.floor(total / 600);
	const seconds = Math.floor((total % 600) / 10);
	const tenth = total % 10;
	return `${minutes}:${String(seconds).padStart(2, "0")}.${tenth}`;
}
