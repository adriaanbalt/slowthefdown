import { describe, expect, it } from "vitest";
import { cloneTuning } from "../constants";
import { difficultyAt, paramsAt } from "../difficulty";

const tuning = cloneTuning();

describe("difficultyAt", () => {
	it("stays at 0 through the 20 s settle period", () => {
		expect(difficultyAt(0, tuning)).toBe(0);
		expect(difficultyAt(20, tuning)).toBe(0);
	});

	it.each([
		[30, 0.083],
		[120, 0.416],
		[300, 0.855],
		[600, 1.424],
	])("D(%i s) is about %f", (t, expected) => {
		expect(difficultyAt(t, tuning)).toBeCloseTo(expected, 2);
	});

	it("crosses 1 at about 370 s", () => {
		expect(difficultyAt(369, tuning)).toBeLessThan(1);
		expect(difficultyAt(371, tuning)).toBeGreaterThan(1);
	});

	it("keeps rising with no cap", () => {
		expect(difficultyAt(1800, tuning)).toBeGreaterThan(difficultyAt(1200, tuning));
	});
});

describe("paramsAt", () => {
	it("uses the start values at D = 0", () => {
		expect(paramsAt(0, tuning)).toEqual({
			heldSpeed: 0.21,
			looseSpeed: 1.2,
			pathRadius: 9,
			octave: 0,
			hitRadius: 4,
			refill: 25,
		});
	});

	it("uses the end values at D = 1", () => {
		const p = paramsAt(1, tuning);
		expect(p.heldSpeed).toBeCloseTo(1.0);
		expect(p.looseSpeed).toBeCloseTo(1.8);
		expect(p.pathRadius).toBeCloseTo(12);
		expect(p.octave).toBeCloseTo(0.3);
		expect(p.hitRadius).toBeCloseTo(3.25);
		expect(p.refill).toBeCloseTo(12);
	});

	it("clamps capped values and keeps extrapolating speeds at D = 1.42", () => {
		const p = paramsAt(1.42, tuning);
		expect(p.refill).toBe(8);
		expect(p.pathRadius).toBe(13);
		expect(p.octave).toBe(0.4);
		expect(p.hitRadius).toBeCloseTo(2.935, 3);
		expect(p.heldSpeed).toBeCloseTo(0.21 + 0.79 * 1.42, 6);
		expect(p.looseSpeed).toBeCloseTo(1.2 + 0.6 * 1.42, 6);
	});

	it("never shrinks the hit area below its floor", () => {
		expect(paramsAt(10, tuning).hitRadius).toBe(2.75);
	});
});
