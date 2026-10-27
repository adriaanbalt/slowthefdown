import { type Tuning, tuning as liveTuning } from "./constants";
import { createRng } from "./random";
import {
	FIXED_WORLDS,
	RELEASED_POOL,
	type WorldId,
	WorldSchedule,
	type WorldScheduleOptions,
} from "./worldSchedule";

export interface WorldRotationOptions extends WorldScheduleOptions {
	tuning?: Tuning;
	seed?: number;
	runIndex?: number;
	startWorld?: WorldId;
}

// Milestone timing + fade cooldown shared by focus and classic runs.
export class WorldRotation {
	private readonly tuning: Tuning;
	private readonly scheduleOptions: WorldRotationOptions;
	private schedule: WorldSchedule;
	private lastSwitchAt = -Infinity;

	constructor(options: WorldRotationOptions = {}) {
		this.tuning = options.tuning ?? liveTuning;
		this.scheduleOptions = options;
		this.schedule = this.createSchedule(options);
	}

	get current(): WorldId {
		return this.schedule.current;
	}

	get reached(): number {
		return this.schedule.reached;
	}

	reset(runIndex = 0): void {
		this.schedule = this.createSchedule({ ...this.scheduleOptions, runIndex });
		this.lastSwitchAt = -Infinity;
	}

	/**
	 * @param progressS — focus time or cumulative hold time for milestones
	 * @param clockS — run/session clock for spacing fades
	 * @param ready — mode-specific gate (on target, focus level, etc.)
	 */
	step(progressS: number, clockS: number, ready: boolean): WorldId | null {
		const canSwitch =
			ready && clockS - this.lastSwitchAt >= this.tuning.worldFadeS;
		const next = this.schedule.update(progressS, canSwitch);
		if (next !== null) this.lastSwitchAt = clockS;
		return next;
	}

	private createSchedule(options: WorldRotationOptions): WorldSchedule {
		const { startWorld, fixed, pool, rng, seed, runIndex = 0 } = options;
		let fixedWorlds = fixed ?? FIXED_WORLDS;
		if (startWorld) {
			fixedWorlds = [startWorld, ...fixedWorlds.filter((w) => w !== startWorld)];
		}
		return new WorldSchedule({
			fixed: fixedWorlds,
			pool: pool ?? RELEASED_POOL,
			rng: rng ?? createRng(seed === undefined ? Date.now() : seed + runIndex),
			tuning: this.tuning,
		});
	}
}
