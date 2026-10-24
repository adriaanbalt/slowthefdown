import { type Tuning, tuning as liveTuning } from "./constants";
import { type DifficultyParams, difficultyAt, paramsAt } from "./difficulty";
import { FocusMeter, type MeterEvent, type MeterInput, type MeterPhase } from "./FocusMeter";
import { createRng } from "./random";
import {
	FIXED_WORLDS,
	RELEASED_POOL,
	type WorldId,
	WorldSchedule,
} from "./worldSchedule";

export type RunEvent = MeterEvent | "worldChange";

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
	private readonly options: RunControllerOptions;
	private readonly meter: FocusMeter;
	private schedule: WorldSchedule;
	private runs = 0;
	private lastSwitchRunTime = -Infinity;

	constructor(options: RunControllerOptions = {}) {
		this.options = options;
		this.tuning = options.tuning ?? liveTuning;
		this.meter = new FocusMeter(this.tuning);
		this.schedule = this.createSchedule();
	}

	get phase(): MeterPhase {
		return this.meter.phase;
	}

	reset(): void {
		this.meter.reset();
		this.runs += 1;
		this.schedule = this.createSchedule();
		this.lastSwitchRunTime = -Infinity;
	}

	step(dtS: number, input: MeterInput): RunSnapshot {
		const meter = this.meter;
		const d = meter.phase === "running" ? difficultyAt(meter.runTime, this.tuning) : 0;
		const refill = paramsAt(d, this.tuning).refill;

		const events: RunEvent[] = meter.update(dtS, input, refill);

		const difficulty =
			meter.phase === "idle" ? 0 : difficultyAt(meter.runTime, this.tuning);
		const params = paramsAt(difficulty, this.tuning);

		if (meter.phase === "running") {
			// the fade cooldown is wall-clock run time, not focus time: a fade
			// keeps playing through slips
			const canSwitch =
				input.onTarget &&
				meter.focus > this.tuning.worldMinFocus &&
				meter.runTime - this.lastSwitchRunTime >= this.tuning.worldFadeS;
			if (this.schedule.update(meter.focusTime, canSwitch) !== null) {
				this.lastSwitchRunTime = meter.runTime;
				events.push("worldChange");
			}
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
			world: this.schedule.current,
			worldsReached: this.schedule.reached,
			events,
		};
	}

	private targetSpeed(input: MeterInput, params: DifficultyParams): number {
		if (this.meter.phase !== "running") return this.tuning.idleSpeed;
		return input.onTarget ? params.heldSpeed : params.looseSpeed;
	}

	private createSchedule(): WorldSchedule {
		const { seed, startWorld, fixedWorlds, worldPool } = this.options;
		let fixed = fixedWorlds ?? FIXED_WORLDS;
		if (startWorld) fixed = [startWorld, ...fixed.filter((w) => w !== startWorld)];
		return new WorldSchedule({
			fixed,
			pool: worldPool ?? RELEASED_POOL,
			rng: createRng(seed === undefined ? Date.now() : seed + this.runs),
			tuning: this.tuning,
		});
	}
}
