import { type Range, type Tuning, tuning as liveTuning } from "./constants";

export interface DifficultyParams {
	heldSpeed: number;
	looseSpeed: number;
	pathRadius: number;
	octave: number;
	hitRadius: number;
	refill: number;
}

export function difficultyAt(
	runTimeS: number,
	tuning: Tuning = liveTuning,
): number {
	const x = Math.max(0, runTimeS - tuning.settleS) / tuning.timeScaleS;
	return Math.pow(x, tuning.exponent);
}

export function valueAt(range: Range, d: number): number {
	let value = range.start + (range.end - range.start) * d;
	if (range.min !== undefined) value = Math.max(range.min, value);
	if (range.max !== undefined) value = Math.min(range.max, value);
	return value;
}

export function paramsAt(
	d: number,
	tuning: Tuning = liveTuning,
): DifficultyParams {
	return {
		heldSpeed: valueAt(tuning.heldSpeed, d),
		looseSpeed: valueAt(tuning.looseSpeed, d),
		pathRadius: valueAt(tuning.pathRadius, d),
		octave: valueAt(tuning.octave, d),
		hitRadius: valueAt(tuning.hitRadius, d),
		refill: valueAt(tuning.refill, d),
	};
}
