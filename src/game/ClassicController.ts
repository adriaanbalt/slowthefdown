import { type Tuning, tuning as liveTuning } from "./constants";
import type { WorldId } from "./worldSchedule";
import { WorldRotation, type WorldRotationOptions } from "./worldRotation";

export type ClassicEvent = "worldChange";

export interface ClassicInput {
	onTarget: boolean;
	scoring: boolean;
}

export interface ClassicSnapshot {
	holdTimeS: number;
	sessionTimeS: number;
	world: WorldId;
	worldsReached: number;
	events: ClassicEvent[];
}

export interface ClassicControllerOptions extends WorldRotationOptions {
	tuning?: Tuning;
}

export class ClassicController {
	private readonly tuning: Tuning;
	private readonly options: ClassicControllerOptions;
	private readonly worldRotation: WorldRotation;
	private holdTimeS = 0;
	private sessionTimeS = 0;
	private runs = 0;

	constructor(options: ClassicControllerOptions = {}) {
		this.options = options;
		this.tuning = options.tuning ?? liveTuning;
		this.worldRotation = new WorldRotation(options);
	}

	reset(): void {
		this.holdTimeS = 0;
		this.sessionTimeS = 0;
		this.runs += 1;
		this.worldRotation.reset(this.runs);
	}

	step(dtS: number, input: ClassicInput): ClassicSnapshot {
		const events: ClassicEvent[] = [];
		const dt = Math.min(Math.max(dtS, 0), this.tuning.maxFrameS);

		if (input.scoring) {
			this.sessionTimeS += dt;
			if (input.onTarget) this.holdTimeS += dt;

			if (
				this.worldRotation.step(this.holdTimeS, this.sessionTimeS, input.onTarget) !==
				null
			) {
				events.push("worldChange");
			}
		}

		return {
			holdTimeS: this.holdTimeS,
			sessionTimeS: this.sessionTimeS,
			world: this.worldRotation.current,
			worldsReached: this.worldRotation.reached,
			events,
		};
	}
}
