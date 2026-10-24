import { type Tuning, tuning as liveTuning } from "./constants";

export type MeterPhase = "idle" | "running" | "ended";

export type MeterEvent =
	| "runStart"
	| "drainStart"
	| "lowFocus"
	| "recovered"
	| "runEnd";

export interface MeterInput {
	// the finger is over the F's hit area
	onTarget: boolean;
	// the finger is on the screen at all
	touching: boolean;
}

export class FocusMeter {
	phase: MeterPhase = "idle";
	// 0 (run over) to 1 (full)
	focus = 1;
	// seconds on target, each weighted by the focus level at the time
	focusTime = 0;
	runTime = 0;
	// times focus dropped below `lowFocus` and was later refilled to full
	recoveries = 0;

	private holdS = 0;
	private offS = 0;
	private drainS = 0;
	private graceArmed = false;
	private slipHasGrace = false;
	private isLowNow = false;
	private readonly tuning: Tuning;

	constructor(tuning: Tuning = liveTuning) {
		this.tuning = tuning;
	}

	get scoreTenths(): number {
		return Math.floor(this.focusTime * 10);
	}

	get isDraining(): boolean {
		return this.phase === "running" && this.drainS > 0;
	}

	get inGrace(): boolean {
		return (
			this.phase === "running" &&
			this.offS > 0 &&
			this.drainS === 0 &&
			this.slipHasGrace
		);
	}

	get isLow(): boolean {
		return this.isLowNow;
	}

	reset(): void {
		this.phase = "idle";
		this.focus = 1;
		this.focusTime = 0;
		this.runTime = 0;
		this.recoveries = 0;
		this.holdS = 0;
		this.offS = 0;
		this.drainS = 0;
		this.graceArmed = false;
		this.slipHasGrace = false;
		this.isLowNow = false;
	}

	// `refillPerS` comes from the difficulty curve, in percent per second.
	update(
		dtS: number,
		input: MeterInput,
		refillPerS: number = this.tuning.refill.start,
	): MeterEvent[] {
		const events: MeterEvent[] = [];
		if (this.phase === "ended") return events;

		if (this.phase === "idle") {
			if (!input.onTarget) return events;
			this.phase = "running";
			events.push("runStart");
		}

		const dt = Math.min(Math.max(dtS, 0), this.tuning.maxFrameS);
		// a zero-length frame must not count as the first frame of a slip
		if (dt === 0) return events;
		this.runTime += dt;

		if (input.onTarget) {
			this.hold(dt, refillPerS, events);
		} else {
			this.slip(dt, input.touching, events);
		}
		return events;
	}

	private hold(dt: number, refillPerS: number, events: MeterEvent[]): void {
		this.offS = 0;
		this.drainS = 0;
		this.slipHasGrace = false;

		this.holdS += dt;
		if (this.holdS >= this.tuning.graceRearmS) this.graceArmed = true;

		this.focus = Math.min(1, this.focus + (refillPerS / 100) * dt);
		this.focusTime += this.focus * dt;

		if (this.isLowNow && this.focus >= 1) {
			this.isLowNow = false;
			this.recoveries += 1;
			events.push("recovered");
		}
	}

	private slip(dt: number, touching: boolean, events: MeterEvent[]): void {
		if (this.offS === 0) {
			this.slipHasGrace = this.graceArmed && touching;
			this.graceArmed = false;
			this.holdS = 0;
		}
		// lifting the finger ends any grace that is still running
		if (!touching) this.slipHasGrace = false;

		const graceLeft = this.slipHasGrace
			? Math.max(0, this.tuning.graceS - this.offS)
			: 0;
		this.offS += dt;

		const drainDt = Math.max(0, dt - graceLeft);
		if (drainDt === 0) return;

		if (this.drainS === 0) events.push("drainStart");
		const drained = this.drainedBetween(this.drainS, this.drainS + drainDt);
		this.drainS += drainDt;
		this.focus = Math.max(0, this.focus - drained / 100);

		if (!this.isLowNow && this.focus < this.tuning.lowFocus) {
			this.isLowNow = true;
			events.push("lowFocus");
		}
		if (this.focus === 0) {
			this.phase = "ended";
			events.push("runEnd");
		}
	}

	// Percent drained between two moments of a slip. The drain rate climbs
	// linearly from drainStart to drainMax over drainRampS, then holds, so
	// this is the exact area under that curve and doesn't depend on frame rate.
	private drainedBetween(fromS: number, toS: number): number {
		return this.drainArea(toS) - this.drainArea(fromS);
	}

	private drainArea(s: number): number {
		const { drainStart, drainMax, drainRampS } = this.tuning;
		if (drainRampS <= 0) return drainMax * s;
		const slope = (drainMax - drainStart) / drainRampS;
		if (s <= drainRampS) return drainStart * s + (slope * s * s) / 2;
		const rampArea = drainStart * drainRampS + (slope * drainRampS * drainRampS) / 2;
		return rampArea + drainMax * (s - drainRampS);
	}
}
