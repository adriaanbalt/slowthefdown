const TIMER_DIGITS = 8;
const MAX_TIMER_MS = 10 ** TIMER_DIGITS - 1;

/** Live HUD: milliseconds, zero-padded to 8 digits (no colons). */
export function formatTimerMs(ms: number): string {
	const clamped = Math.min(Math.max(0, Math.floor(ms)), MAX_TIMER_MS);
	return String(clamped).padStart(TIMER_DIGITS, "0");
}

/** Leaderboard / profile: stored scores are tenths of a second. */
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
