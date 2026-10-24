import { describe, expect, it } from "vitest";
import { cloneTuning } from "../constants";
import { FocusMeter, type MeterEvent, type MeterInput } from "../FocusMeter";

const HOLD: MeterInput = { onTarget: true, touching: true };
const SLIP: MeterInput = { onTarget: false, touching: true };
const LIFT: MeterInput = { onTarget: false, touching: false };
const FRAME = 1 / 60;

function play(
	meter: FocusMeter,
	seconds: number,
	input: MeterInput,
	refill?: number,
): MeterEvent[] {
	const events: MeterEvent[] = [];
	const frames = Math.round(seconds / FRAME);
	for (let i = 0; i < frames; i++) {
		events.push(...meter.update(FRAME, input, refill));
	}
	return events;
}

// a meter that's running with grace armed and focus full
function armedMeter(): FocusMeter {
	const meter = new FocusMeter(cloneTuning());
	play(meter, 1, HOLD);
	return meter;
}

describe("FocusMeter run lifecycle", () => {
	it("stays idle until the finger first lands on the F", () => {
		const meter = new FocusMeter(cloneTuning());
		play(meter, 1, SLIP);
		play(meter, 1, LIFT);
		expect(meter.phase).toBe("idle");
		expect(meter.runTime).toBe(0);

		const events = meter.update(FRAME, HOLD);
		expect(events).toContain("runStart");
		expect(meter.phase).toBe("running");
	});

	it("starts full", () => {
		expect(new FocusMeter(cloneTuning()).focus).toBe(1);
	});

	it("ends the run when focus empties and then ignores input", () => {
		const meter = armedMeter();
		const events = play(meter, 3, SLIP);
		expect(events).toContain("runEnd");
		expect(meter.phase).toBe("ended");
		expect(meter.focus).toBe(0);

		const runTime = meter.runTime;
		play(meter, 1, HOLD);
		expect(meter.phase).toBe("ended");
		expect(meter.runTime).toBe(runTime);
	});

	it("reset returns to idle with a full meter", () => {
		const meter = armedMeter();
		play(meter, 3, SLIP);
		meter.reset();
		expect(meter.phase).toBe("idle");
		expect(meter.focus).toBe(1);
		expect(meter.focusTime).toBe(0);
		expect(meter.recoveries).toBe(0);
	});
});

describe("FocusMeter drain", () => {
	it("a 0.5 s slip with the finger down leaves 91.25%", () => {
		const meter = armedMeter();
		play(meter, 0.5, SLIP);
		expect(meter.focus * 100).toBeCloseTo(91.25, 1);
	});

	it("a 1 s slip with the finger down leaves 66.25%", () => {
		const meter = armedMeter();
		play(meter, 1, SLIP);
		expect(meter.focus * 100).toBeCloseTo(66.25, 1);
	});

	it("empties from full in about 1.86 s", () => {
		const meter = armedMeter();
		const start = meter.runTime;
		const step = 1 / 1000;
		while (meter.phase === "running") meter.update(step, SLIP);
		expect(meter.runTime - start).toBeCloseTo(1.861, 2);
	});

	it("drains the same amount at 60 Hz and 120 Hz", () => {
		const at60 = armedMeter();
		const at120 = armedMeter();
		for (let i = 0; i < 60; i++) at60.update(1 / 60, SLIP);
		for (let i = 0; i < 120; i++) at120.update(1 / 120, SLIP);
		expect(at120.focus).toBeCloseTo(at60.focus, 6);
	});

	it("splits grace from drain inside a frame at 90 Hz", () => {
		const meter = armedMeter();
		for (let i = 0; i < 45; i++) meter.update(1 / 90, SLIP);
		expect(meter.focus * 100).toBeCloseTo(91.25, 4);
	});

	it("a zero-length frame doesn't use up grace", () => {
		const meter = armedMeter();
		meter.update(0, SLIP);
		play(meter, 0.25, SLIP);
		expect(meter.focus).toBe(1);
	});

	it("a long frame advances at most maxFrameS", () => {
		const meter = armedMeter();
		const before = meter.runTime;
		meter.update(5, SLIP);
		expect(meter.runTime - before).toBeCloseTo(0.1, 6);
	});

	it("fires drainStart once, when grace runs out", () => {
		const meter = armedMeter();
		const graceEvents = play(meter, 0.2, SLIP);
		expect(graceEvents).not.toContain("drainStart");
		expect(meter.inGrace).toBe(true);
		expect(meter.isDraining).toBe(false);

		const drainEvents = play(meter, 0.5, SLIP);
		expect(drainEvents.filter((e) => e === "drainStart")).toHaveLength(1);
		expect(meter.isDraining).toBe(true);
		expect(meter.inGrace).toBe(false);
	});
});

describe("FocusMeter grace", () => {
	it("gives no grace when the finger leaves the screen", () => {
		const meter = armedMeter();
		play(meter, 0.25, LIFT);
		expect(meter.focus * 100).toBeCloseTo(91.25, 1);
	});

	it("ends grace early if the finger lifts during it", () => {
		const meter = armedMeter();
		play(meter, 0.1, SLIP);
		expect(meter.focus).toBe(1);
		play(meter, 0.25, LIFT);
		expect(meter.focus * 100).toBeCloseTo(91.25, 1);
	});

	it("has no grace in the first 0.5 s of a run", () => {
		const meter = new FocusMeter(cloneTuning());
		play(meter, 0.3, HOLD);
		play(meter, 0.25, SLIP);
		expect(meter.focus * 100).toBeCloseTo(91.25, 1);
	});

	it("does not re-arm after a recatch shorter than 0.5 s", () => {
		const meter = armedMeter();
		play(meter, 0.1, SLIP);
		play(meter, 0.3, HOLD);
		expect(meter.focus).toBe(1);
		play(meter, 0.25, SLIP);
		expect(meter.focus * 100).toBeCloseTo(91.25, 1);
	});

	it("re-arms after a recatch of 0.5 s or more", () => {
		const meter = armedMeter();
		play(meter, 0.1, SLIP);
		play(meter, 0.6, HOLD);
		play(meter, 0.25, SLIP);
		expect(meter.focus).toBe(1);
	});
});

describe("FocusMeter refill and scoring", () => {
	it("refills at the given rate while on target", () => {
		const meter = armedMeter();
		play(meter, 1, SLIP);
		const low = meter.focus;
		play(meter, 1, HOLD, 25);
		expect(meter.focus - low).toBeCloseTo(0.25, 2);
	});

	it("caps focus at full", () => {
		const meter = armedMeter();
		play(meter, 5, HOLD, 25);
		expect(meter.focus).toBe(1);
	});

	it("10 s held at full focus earns 10.0 s of focus time", () => {
		const meter = new FocusMeter(cloneTuning());
		play(meter, 10, HOLD);
		expect(meter.focusTime).toBeCloseTo(10, 6);
		expect(meter.scoreTenths).toBe(100);
	});

	it("earns nothing while off target", () => {
		const meter = armedMeter();
		const before = meter.focusTime;
		play(meter, 0.2, SLIP);
		expect(meter.focusTime).toBe(before);
	});

	it("weights time on target by the focus level", () => {
		const meter = armedMeter();
		play(meter, 1, SLIP);
		const before = meter.focusTime;
		// refill 0 keeps focus at its post-slip level of 66.25%
		play(meter, 1, HOLD, 0);
		expect(meter.focusTime - before).toBeCloseTo(0.6625, 2);
	});
});

describe("FocusMeter recoveries", () => {
	it("counts a drop below 25% followed by a refill to full", () => {
		const meter = armedMeter();
		const lowEvents = play(meter, 1.6, SLIP);
		expect(meter.focus).toBeLessThan(0.25);
		expect(meter.isLow).toBe(true);
		expect(lowEvents.filter((e) => e === "lowFocus")).toHaveLength(1);

		const holdEvents = play(meter, 4, HOLD, 25);
		expect(holdEvents.filter((e) => e === "recovered")).toHaveLength(1);
		expect(meter.recoveries).toBe(1);
		expect(meter.isLow).toBe(false);
	});

	it("does not count a refill that never dropped below 25%", () => {
		const meter = armedMeter();
		play(meter, 1, SLIP);
		play(meter, 4, HOLD, 25);
		expect(meter.recoveries).toBe(0);
	});
});
