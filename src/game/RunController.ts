import { type Tuning, tuning as liveTuning } from "./constants";
import { type DifficultyParams, difficultyAt, paramsAt } from "./difficulty";
import { FocusMeter, type MeterEvent, type MeterInput, type MeterPhase } from "./FocusMeter";
import type { WorldId } from "./worldSchedule";
import { WorldRotation } from "./worldRotation";

export type RunEvent = MeterEvent | "worldChange" | "worldReset";

export interface RunSnapshot {
	phase: MeterPhase;
	focus: number;
	focusTime: number;
	scoreTenths: number;
	runTime: number;
	recoveries: number;
	difficulty: number;
	params: DifficultyParams;
	// the angular speed the F should ease toward this frame
	targetSpeed: number;
	isDraining: boolean;
	inGrace: boolean;
	isLow: boolean;
	world: WorldId;
	worldsReached: number;
	events: RunEvent[];
}

export interface RunControllerOptions {
	tuning?: Tuning;
	seed?: number;
	startWorld?: WorldId;
	fixedWorlds?: readonly WorldId[];
	worldPool?: readonly WorldId[];
}

// Pure per-frame game rules. The render loop calls `step` once a frame with
// what the finger is doing and draws whatever the snapshot says.
export class RunController {
	private readonly tuning: Tuning;
	private readonly meter: FocusMeter;
	private readonly worldRotation: WorldRotation;
	private runs = 0;
	// seconds on the F since the last slip; the world stack follows this streak
	private worldHoldS = 0;
	private streak = false;

	constructor(options: RunControllerOptions = {}) {
		this.tuning = options.tuning ?? liveTuning;
		this.meter = new FocusMeter(this.tuning);
		this.worldRotation = new WorldRotation({
			tuning: this.tuning,
			seed: options.seed,
			startWorld: options.startWorld,
			fixed: options.fixedWorlds,
			pool: options.worldPool,
		});
	}

	get phase(): MeterPhase {
		return this.meter.phase;
	}

	reset(): void {
		this.meter.reset();
		this.worldHoldS = 0;
		this.streak = false;
		this.runs += 1;
		this.worldRotation.reset(this.runs);
	}

	step(dtS: number, input: MeterInput): RunSnapshot {
		const meter = this.meter;
		const d = meter.phase === "running" ? difficultyAt(meter.runTime, this.tuning) : 0;
		const refill = paramsAt(d, this.tuning).refill;

		const events: RunEvent[] = meter.update(dtS, input, refill);

		const difficulty =
			meter.phase === "idle" ? 0 : difficultyAt(meter.runTime, this.tuning);
		const params = paramsAt(difficulty, this.tuning);

		if (meter.phase === "running" && input.onTarget) {
			this.streak = true;
			this.worldHoldS += Math.min(Math.max(dtS, 0), this.tuning.maxFrameS);
			if (
				this.worldRotation.step(
					this.worldHoldS,
					meter.runTime,
					meter.focus > this.tuning.worldMinFocus,
				) !== null
			) {
				events.push("worldChange");
			}
		} else if (this.streak) {
			this.streak = false;
			this.worldHoldS = 0;
			this.worldRotation.reset(this.runs);
			events.push("worldReset");
		}

		return {
			phase: meter.phase,
			focus: meter.focus,
			focusTime: meter.focusTime,
			scoreTenths: meter.scoreTenths,
			runTime: meter.runTime,
			recoveries: meter.recoveries,
			difficulty,
			params,
			targetSpeed: this.targetSpeed(input, params),
			isDraining: meter.isDraining,
			inGrace: meter.inGrace,
			isLow: meter.isLow,
			world: this.worldRotation.current,
			worldsReached: this.worldRotation.reached,
			events,
		};
	}

	private targetSpeed(input: MeterInput, params: DifficultyParams): number {
		if (this.meter.phase !== "running") return this.tuning.idleSpeed;
		return input.onTarget ? params.heldSpeed : params.looseSpeed;
	}
}
