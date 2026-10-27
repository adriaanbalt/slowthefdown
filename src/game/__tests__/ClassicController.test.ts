import { describe, expect, it } from "vitest";
import { cloneTuning } from "../constants";
import { ClassicController } from "../ClassicController";

const FRAME = 1 / 60;

function play(
	run: ClassicController,
	seconds: number,
	onTarget: boolean,
	scoring = true,
) {
	const events: string[] = [];
	let last = run.step(FRAME, { onTarget, scoring });
	events.push(...last.events);
	const frames = Math.round(seconds / FRAME);
	for (let i = 1; i < frames; i++) {
		last = run.step(FRAME, { onTarget, scoring });
		events.push(...last.events);
	}
	return { last, events };
}

describe("ClassicController", () => {
	it("starts on particles", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		expect(play(run, 0.1, false).last.world).toBe("particles");
	});

	it("changes world after 30 s of hold time while on target", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		const early = play(run, 29, true);
		expect(early.events).not.toContain("worldChange");
		const later = play(run, 2, true);
		expect(later.events).toContain("worldChange");
		expect(later.last.world).toBe("ink");
		expect(later.last.worldsReached).toBe(2);
	});

	it("does not advance hold progress off target", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		play(run, 30, true);
		const mid = play(run, 20, false);
		expect(mid.last.holdTimeS).toBeCloseTo(30, 1);
		expect(mid.events).not.toContain("worldChange");
	});

	it("resets worlds on reset", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		play(run, 50, true);
		run.reset();
		expect(play(run, 0.1, false).last.world).toBe("particles");
		expect(play(run, 0.1, false).last.holdTimeS).toBe(0);
	});
});
