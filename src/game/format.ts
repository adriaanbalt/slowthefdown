const TIMER_DIGITS = 8;
const MAX_TIMER_MS = 10 ** TIMER_DIGITS - 1;

/** Live HUD: milliseconds, zero-padded to 8 digits (no colons). */
export function formatTimerMs(ms: number): string {
	const clamped = Math.min(Math.max(0, Math.floor(ms)), MAX_TIMER_MS);
	return String(clamped).padStart(TIMER_DIGITS, "0");
}

/**
 * Leaderboard / profile. Stored scores are tenths of a second.
 * Whole seconds, as H:MM:SS. Hours are omitted when zero, and neither
 * hours nor minutes get a leading zero.
 */
export function formatStoredScore(tenths: number): string {
	const totalSeconds = Math.floor(Math.max(0, Math.floor(tenths)) / 10);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const ss = String(seconds).padStart(2, "0");
	if (hours > 0) {
		const mm = String(minutes).padStart(2, "0");
		return `${hours}:${mm}:${ss}`;
	}
	return `${minutes}:${ss}`;
}

/** @deprecated Prefer formatTimerMs / formatStoredScore. Kept for focus-meter tests. */
export function formatFocusTime(tenths: number): string {
	const total = Math.max(0, Math.floor(tenths));
	const minutes = Math.floor(total / 600);
	const seconds = Math.floor((total % 600) / 10);
	const tenth = total % 10;
	return `${minutes}:${String(seconds).padStart(2, "0")}.${tenth}`;
}
