import { type Tuning, tuning as liveTuning } from "./constants";
import { type Rng, createRng, shuffle } from "./random";

export type WorldId =
	| "particles"
	| "ink"
	| "starfield"
	| "aurora"
	| "vortex"
	| "caustics"
	| "rain"
	| "smoke"
	| "fireflies"
	| "topographic"
	| "bioluminescent"
	| "nebula";

export const FIXED_WORLDS = [
	"particles",
	"ink",
	"starfield",
	"aurora",
] as const satisfies readonly WorldId[];

// worlds shipped in the first release beyond the fixed opening four
export const RELEASED_POOL = ["vortex", "caustics"] as const satisfies readonly WorldId[];

export type RotationWorldId =
	| (typeof FIXED_WORLDS)[number]
	| (typeof RELEASED_POOL)[number];

const ROTATION_SET = new Set<WorldId>([...FIXED_WORLDS, ...RELEASED_POOL]);

export function isRotationWorld(id: WorldId): id is RotationWorldId {
	return ROTATION_SET.has(id);
}

export interface WorldScheduleOptions {
	fixed?: readonly WorldId[];
	pool?: readonly WorldId[];
	rng?: Rng;
	tuning?: Tuning;
}

// Decides which world is showing. The first new world is due after
// `worldFirstS` of focus time and each gap after that is `worldStepS` longer
// (15, 20, 25, ...); the switch itself waits until the caller says it may happen.
export class WorldSchedule {
	current: WorldId;
	// worlds shown this run, including the first
	reached = 1;

	private readonly fixed: readonly WorldId[];
	private readonly pool: readonly WorldId[];
	private readonly rng: Rng;
	private readonly tuning: Tuning;
	private queue: WorldId[] = [];
	private interval: number;
	private nextMilestone: number;
	private pending = false;

	constructor(options: WorldScheduleOptions = {}) {
		this.tuning = options.tuning ?? liveTuning;
		this.rng = options.rng ?? createRng(Date.now());
		this.fixed = options.fixed ?? FIXED_WORLDS;
		const pool = options.pool ?? RELEASED_POOL;
		// a single-world pool would repeat itself, so fold the fixed worlds in
		this.pool =
			pool.length > 1 ? pool : Array.from(new Set([...this.fixed, ...pool]));
		if (this.fixed.length === 0 && this.pool.length === 0) {
			throw new Error("WorldSchedule needs at least one world");
		}

		this.queue = this.fixed.slice(1);
		this.current = this.fixed[0] ?? this.takeFromPool();
		this.interval = Math.max(1, this.tuning.worldFirstS);
		this.nextMilestone = this.interval;
	}

	get isPending(): boolean {
		return this.pending;
	}

	// Returns the world to fade to when a switch starts this frame, else null.
	update(focusTimeS: number, canSwitch: boolean): WorldId | null {
		if (focusTimeS >= this.nextMilestone) {
			this.pending = true;
			// milestones passed while a switch was waiting don't stack up
			while (focusTimeS >= this.nextMilestone) {
				this.interval += Math.max(0, this.tuning.worldStepS);
				this.nextMilestone += this.interval;
			}
		}
		if (!this.pending || !canSwitch) return null;

		this.pending = false;
		this.current = this.next();
		this.reached += 1;
		return this.current;
	}

	private next(): WorldId {
		const queued = this.queue.shift();
		return queued ?? this.takeFromPool();
	}

	private takeFromPool(): WorldId {
		let round = shuffle(this.pool, this.rng);
		// avoid showing the same world twice in a row across reshuffles
		if (round.length > 1 && round[0] === this.current) {
			round = [...round.slice(1), round[0]];
		}
		const [first, ...rest] = round;
		this.queue = rest;
		return first as WorldId;
	}
}
