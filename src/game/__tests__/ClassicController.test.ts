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

	it("changes world after 15 s of hold time while on target", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		const early = play(run, 14, true);
		expect(early.events).not.toContain("worldChange");
		const later = play(run, 2, true);
		expect(later.events).toContain("worldChange");
		expect(later.last.world).toBe("ink");
		expect(later.last.worldsReached).toBe(2);
	});

	it("clears the world streak when the F is lost", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		const held = play(run, 20, true);
		expect(held.last.world).toBe("ink");

		const lost = play(run, 0.1, false);
		expect(lost.events).toContain("worldReset");
		expect(lost.last.world).toBe("particles");
		expect(lost.last.holdTimeS).toBe(0);
		expect(lost.last.worldsReached).toBe(1);

		const stillOff = play(run, 5, false);
		expect(stillOff.events).not.toContain("worldReset");
		expect(stillOff.last.holdTimeS).toBe(0);

		const early = play(run, 14, true);
		expect(early.events).not.toContain("worldChange");
		const next = play(run, 2, true);
		expect(next.events).toContain("worldChange");
		expect(next.last.world).toBe("ink");
	});

	it("resets worlds on reset", () => {
		const run = new ClassicController({ tuning: cloneTuning(), seed: 1 });
		play(run, 50, true);
		run.reset();
		expect(play(run, 0.1, false).last.world).toBe("particles");
		expect(play(run, 0.1, false).last.holdTimeS).toBe(0);
	});
});
