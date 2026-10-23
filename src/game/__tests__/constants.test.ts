import { describe, expect, it } from "vitest";
import { DEFAULT_TUNING, cloneTuning, resetTuning, tuning } from "../constants";

describe("tuning", () => {
	it("deep-freezes the defaults", () => {
		expect(Object.isFrozen(DEFAULT_TUNING)).toBe(true);
		expect(Object.isFrozen(DEFAULT_TUNING.refill)).toBe(true);
	});

	it("clones nested ranges so edits don't leak", () => {
		const copy = cloneTuning();
		copy.refill.start = 99;
		expect(DEFAULT_TUNING.refill.start).toBe(25);
		expect(cloneTuning().refill.start).toBe(25);
	});

	it("resetTuning restores the live values", () => {
		tuning.timeScaleS = 1;
		tuning.heldSpeed.end = 5;
		resetTuning();
		expect(tuning.timeScaleS).toBe(350);
		expect(tuning.heldSpeed.end).toBe(1);
	});
});
