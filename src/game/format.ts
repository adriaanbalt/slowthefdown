// Scores are stored in tenths of a second; displayed as m:ss.t
export function formatFocusTime(tenths: number): string {
	const total = Math.max(0, Math.floor(tenths));
	const minutes = Math.floor(total / 600);
	const seconds = Math.floor((total % 600) / 10);
	const tenth = total % 10;
	return `${minutes}:${String(seconds).padStart(2, "0")}.${tenth}`;
}
