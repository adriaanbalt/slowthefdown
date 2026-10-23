// A value that moves with difficulty: `start` at D = 0, `end` at D = 1,
// extrapolated linearly past D = 1 and clamped to `min` / `max` when set.
export interface Range {
	start: number;
	end: number;
	min?: number;
	max?: number;
}

export interface Tuning {
	// focus meter, rates in percent of a full meter per second
	graceS: number;
	graceRearmS: number;
	drainStart: number;
	drainMax: number;
	drainRampS: number;
	refill: Range;
	lowFocus: number;

	// difficulty curve: D(t) = (max(0, t - settleS) / timeScaleS) ^ exponent
	settleS: number;
	timeScaleS: number;
	exponent: number;

	// F movement, angular speeds in radians per second, sizes in world units
	heldSpeed: Range;
	looseSpeed: Range;
	idleSpeed: number;
	pathRadius: Range;
	octave: Range;
	hitRadius: Range;
	easeCatchS: number;
	easeSlipS: number;

	// worlds, spacing in seconds of focus time
	worldEveryS: number;
	worldFadeS: number;
	worldMinFocus: number;

	// a long frame (app backgrounded, GC pause) must not advance the run in one step
	maxFrameS: number;
}

type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

function deepFreeze<T extends object>(value: T): DeepReadonly<T> {
	for (const child of Object.values(value)) {
		if (typeof child === "object" && child !== null) deepFreeze(child);
	}
	return Object.freeze(value) as DeepReadonly<T>;
}

export const DEFAULT_TUNING: DeepReadonly<Tuning> = deepFreeze<Tuning>({
	graceS: 0.25,
	graceRearmS: 0.5,
	drainStart: 30,
	drainMax: 90,
	drainRampS: 1.5,
	refill: { start: 25, end: 12, min: 8 },
	lowFocus: 0.25,

	settleS: 20,
	timeScaleS: 350,
	exponent: 0.7,

	heldSpeed: { start: 0.21, end: 1.0 },
	looseSpeed: { start: 1.2, end: 1.8 },
	idleSpeed: 0.6,
	pathRadius: { start: 9, end: 12, max: 13 },
	octave: { start: 0, end: 0.3, max: 0.4 },
	hitRadius: { start: 4, end: 3.25, min: 2.75 },
	easeCatchS: 0.6,
	easeSlipS: 0.8,

	worldEveryS: 45,
	worldFadeS: 5,
	worldMinFocus: 0.5,

	maxFrameS: 0.1,
});

export function cloneTuning(
	source: DeepReadonly<Tuning> = DEFAULT_TUNING,
): Tuning {
	return {
		...source,
		refill: { ...source.refill },
		heldSpeed: { ...source.heldSpeed },
		looseSpeed: { ...source.looseSpeed },
		pathRadius: { ...source.pathRadius },
		octave: { ...source.octave },
		hitRadius: { ...source.hitRadius },
	};
}

// The live values the game reads. The debug panel mutates this object in place.
export const tuning: Tuning = cloneTuning();

export function resetTuning(): void {
	Object.assign(tuning, cloneTuning());
}
