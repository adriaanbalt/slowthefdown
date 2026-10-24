import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "stfd-telemetry-runs";
const MAX_RUNS = 50;

export interface TelemetryRun {
	at: number;
	focusTenths: number;
	runTimeS: number;
	recoveries: number;
	difficulty: number;
}

export async function recordRunTelemetry(run: Omit<TelemetryRun, "at">): Promise<void> {
	try {
		const prev = await readTelemetry();
		const next = [{ ...run, at: Date.now() }, ...prev].slice(0, MAX_RUNS);
		await AsyncStorage.setItem(KEY, JSON.stringify(next));
	} catch (error) {
		console.warn("telemetry write failed", error);
	}
}

export async function readTelemetry(): Promise<TelemetryRun[]> {
	try {
		const raw = await AsyncStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as TelemetryRun[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function summarizeTelemetry(runs: readonly TelemetryRun[]): string {
	if (runs.length === 0) return "No runs logged yet.";
	const n = runs.length;
	const avgLen = runs.reduce((s, r) => s + r.runTimeS, 0) / n;
	const avgRec = runs.reduce((s, r) => s + r.recoveries, 0) / n;
	const avgFocus = runs.reduce((s, r) => s + r.focusTenths, 0) / n;
	return `${n} runs · avg length ${avgLen.toFixed(1)}s · avg recoveries ${avgRec.toFixed(1)} · avg focus ${avgFocus.toFixed(0)} tenths`;
}
