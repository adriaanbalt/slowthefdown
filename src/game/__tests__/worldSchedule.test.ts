import { describe, expect, it } from "vitest";
import { cloneTuning } from "../constants";
import { createRng } from "../random";
import { type WorldId, WorldSchedule } from "../worldSchedule";

const tuning = cloneTuning();

function schedule(seed = 1, pool?: readonly WorldId[]): WorldSchedule {
	return new WorldSchedule({ rng: createRng(seed), tuning, pool });
}

// switch at every milestone and record the worlds shown
function sequence(s: WorldSchedule, count: number): WorldId[] {
	const shown: WorldId[] = [s.current];
	for (let i = 1; i < count; i++) {
		const next = s.update(i * 10_000, true);
		if (next) shown.push(next);
	}
	return shown;
}

describe("WorldSchedule", () => {
	it("opens with the fixed four in order", () => {
		expect(sequence(schedule(), 4)).toEqual([
			"particles",
			"ink",
			"starfield",
			"aurora",
		]);
	});

	it("switches only once the 15 s focus-time milestone passes", () => {
		const s = schedule();
		expect(s.update(14.9, true)).toBeNull();
		expect(s.update(15, true)).toBe("ink");
		expect(s.update(30, true)).toBeNull();
	});

	it("makes each gap 5 s longer than the one before", () => {
		const s = schedule();
		const switches: number[] = [];
		for (let t = 0; t <= 200; t += 0.5) {
			if (s.update(t, true)) switches.push(t);
		}
		expect(switches).toEqual([15, 35, 60, 90, 125, 165]);
	});

	it("waits while switching isn't allowed, then switches", () => {
		const s = schedule();
		expect(s.update(20, false)).toBeNull();
		expect(s.isPending).toBe(true);
		expect(s.update(22, true)).toBe("ink");
		expect(s.isPending).toBe(false);
	});

	it("doesn't stack milestones passed while waiting", () => {
		const s = schedule();
		expect(s.update(100, false)).toBeNull();
		expect(s.update(101, true)).toBe("ink");
		expect(s.update(102, true)).toBeNull();
		expect(s.update(125, true)).toBe("starfield");
	});

	it("uses the pool after the fixed four", () => {
		const shown = sequence(schedule(), 6);
		expect(new Set(shown.slice(4))).toEqual(new Set(["vortex", "caustics"]));
	});

	it("gives the same order for the same seed", () => {
		expect(sequence(schedule(7), 20)).toEqual(sequence(schedule(7), 20));
	});

	it("never shows the same world twice in a row", () => {
		for (let seed = 1; seed <= 50; seed++) {
			const shown = sequence(schedule(seed, ["vortex", "caustics", "rain"]), 40);
			for (let i = 1; i < shown.length; i++) {
				expect(shown[i]).not.toBe(shown[i - 1]);
			}
		}
	});

	it("doesn't repeat a world back to back with a one-world pool", () => {
		const shown = sequence(schedule(3, ["vortex"]), 30);
		expect(shown).toContain("vortex");
		for (let i = 1; i < shown.length; i++) {
			expect(shown[i]).not.toBe(shown[i - 1]);
		}
	});

	it("counts the worlds reached", () => {
		const s = schedule();
		sequence(s, 5);
		expect(s.reached).toBe(5);
	});
});
