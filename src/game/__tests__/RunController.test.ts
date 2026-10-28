import { describe, expect, it } from "vitest";
import { cloneTuning } from "../constants";
import type { MeterInput } from "../FocusMeter";
import { type RunEvent, type RunSnapshot, RunController } from "../RunController";

const HOLD: MeterInput = { onTarget: true, touching: true };
const SLIP: MeterInput = { onTarget: false, touching: true };
const IDLE: MeterInput = { onTarget: false, touching: false };
const FRAME = 1 / 60;

function play(
	run: RunController,
	seconds: number,
	input: MeterInput,
): { last: RunSnapshot; events: RunEvent[] } {
	const events: RunEvent[] = [];
	let last = run.step(FRAME, input);
	events.push(...last.events);
	const frames = Math.round(seconds / FRAME);
	for (let i = 1; i < frames; i++) {
		last = run.step(FRAME, input);
		events.push(...last.events);
	}
	return { last, events };
}

function controller(): RunController {
	return new RunController({ tuning: cloneTuning(), seed: 1 });
}

describe("RunController", () => {
	it("idles at the idle speed with no difficulty", () => {
		const { last } = play(controller(), 2, IDLE);
		expect(last.phase).toBe("idle");
		expect(last.difficulty).toBe(0);
		expect(last.targetSpeed).toBe(0.6);
		expect(last.world).toBe("particles");
	});

	it("starts on first touch and targets the held speed while on the F", () => {
		const run = controller();
		const first = run.step(FRAME, HOLD);
		expect(first.events).toContain("runStart");
		expect(first.phase).toBe("running");
		expect(first.targetSpeed).toBeCloseTo(0.21);
	});

	it("targets the loose speed after a slip", () => {
		const run = controller();
		play(run, 1, HOLD);
		const { last } = play(run, 0.1, SLIP);
		expect(last.targetSpeed).toBeCloseTo(1.2);
	});

	it("raises difficulty with run time after the settle period", () => {
		const run = controller();
		const { last } = play(run, 120, HOLD);
		expect(last.difficulty).toBeCloseTo(0.416, 2);
		expect(last.params.heldSpeed).toBeGreaterThan(0.21);
	});

	it("changes world after 15 s of focus time while holding", () => {
		const run = controller();
		const early = play(run, 14, HOLD);
		expect(early.events).not.toContain("worldChange");
		const later = play(run, 2, HOLD);
		expect(later.events).toContain("worldChange");
		expect(later.last.world).toBe("ink");
		expect(later.last.worldsReached).toBe(2);
	});

	it("clears the world streak when the F is lost and keeps the score", () => {
		const run = controller();
		play(run, 20, HOLD);
		const lost = play(run, 0.2, SLIP);
		expect(lost.events).toContain("worldReset");
		expect(lost.last.world).toBe("particles");
		expect(lost.last.focusTime).toBeGreaterThan(15);
		expect(lost.last.phase).toBe("running");

		const early = play(run, 14, HOLD);
		expect(early.events).not.toContain("worldChange");
		const later = play(run, 2, HOLD);
		expect(later.events).toContain("worldChange");
		expect(later.last.world).toBe("ink");
	});

	it("holds a world change while focus is at or below worldMinFocus", () => {
		const tuning = { ...cloneTuning(), worldMinFocus: 0.95, worldFirstS: 1, worldStepS: 0 };
		const run = new RunController({ tuning, seed: 1 });
		play(run, 0.6, HOLD);
		// 1.3 s off target drops focus to about 46% and clears the streak
		play(run, 1.3, SLIP);
		const blocked = play(run, 1.2, HOLD);
		expect(blocked.last.focus).toBeLessThan(0.95);
		expect(blocked.events).not.toContain("worldChange");
		const resumed = play(run, 2, HOLD);
		expect(resumed.events).toContain("worldChange");
	});

	it("doesn't start a world change while the previous fade is running", () => {
		const tuning = { ...cloneTuning(), worldFirstS: 2, worldStepS: 0 };
		const run = new RunController({ tuning, seed: 1 });
		const { events } = play(run, 9, HOLD);
		// milestones every 2 s, but fades take 5 s: switches at about 2 s and 7 s
		expect(events.filter((e) => e === "worldChange")).toHaveLength(2);
	});

	it("ends the run and returns to the idle speed", () => {
		const run = controller();
		play(run, 1, HOLD);
		const { last, events } = play(run, 3, SLIP);
		expect(events).toContain("runEnd");
		expect(last.phase).toBe("ended");
		expect(last.targetSpeed).toBe(0.6);
	});

	it("reset starts a fresh run from the first world", () => {
		const run = controller();
		play(run, 50, HOLD);
		play(run, 3, SLIP);
		run.reset();
		const { last } = play(run, 0.1, IDLE);
		expect(last.phase).toBe("idle");
		expect(last.world).toBe("particles");
		expect(last.focusTime).toBe(0);
	});

	it("can start from a chosen world", () => {
		const run = new RunController({ tuning: cloneTuning(), seed: 1, startWorld: "aurora" });
		const { last } = play(run, 0.1, IDLE);
		expect(last.world).toBe("aurora");
	});
});
