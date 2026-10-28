import { type Tuning, tuning as liveTuning } from "./constants";
import type { WorldId } from "./worldSchedule";
import { WorldRotation, type WorldRotationOptions } from "./worldRotation";

export type ClassicEvent = "worldChange" | "worldReset";

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
	// true after the finger has been on the F this streak
	private streak = false;

	constructor(options: ClassicControllerOptions = {}) {
		this.options = options;
		this.tuning = options.tuning ?? liveTuning;
		this.worldRotation = new WorldRotation(options);
	}

	reset(): void {
		this.holdTimeS = 0;
		this.sessionTimeS = 0;
		this.streak = false;
		this.runs += 1;
		this.worldRotation.reset(this.runs);
	}

	step(dtS: number, input: ClassicInput): ClassicSnapshot {
		const events: ClassicEvent[] = [];
		const dt = Math.min(Math.max(dtS, 0), this.tuning.maxFrameS);

		if (input.scoring) {
			this.sessionTimeS += dt;
			if (input.onTarget) {
				this.streak = true;
				this.holdTimeS += dt;
				if (this.worldRotation.step(this.holdTimeS, this.sessionTimeS, true) !== null) {
					events.push("worldChange");
				}
			} else if (this.streak) {
				// the stack belongs to this hold; losing the F clears it
				this.streak = false;
				this.holdTimeS = 0;
				this.worldRotation.reset(this.runs);
				events.push("worldReset");
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
