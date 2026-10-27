import type { Vector2 } from "three";
import type { PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";
import type { ExpoWebGLRenderingContext } from "expo-gl";

import { ClassicController } from "@/game/ClassicController";
import type { WorldId } from "@/game/worldSchedule";

import type ObjectToCatch from "./ObjectToCatch";

export interface DriverFrame {
	world: WorldId;
	changed: boolean;
	pace: number;
}

export interface ClassicDriverInput {
	pointer: Vector2;
	scoring: () => boolean;
	onHoldTick: (ms: number) => void;
	onHoldEnd: (ms: number) => void;
}

export interface ClassicDriver {
	frame(dtS: number): DriverFrame;
	reset(): void;
	resetHold(): void;
}

const MIN_FRAME_S = 1 / 120;
const MAX_FRAME_S = 0.1;

export function createClassicDriver(
	_gl: ExpoWebGLRenderingContext,
	_renderer: WebGLRenderer,
	_scene: Scene,
	_camera: PerspectiveCamera,
	_raycaster: Raycaster,
	target: ObjectToCatch,
	input: ClassicDriverInput,
	raycast: () => boolean,
): ClassicDriver {
	const controller = new ClassicController();
	let heldSinceMs = 0;
	const heldMs = (now: number) => now - heldSinceMs;

	return {
		reset() {
			controller.reset();
			heldSinceMs = 0;
		},
		resetHold() {
			heldSinceMs = 0;
		},
		frame(dtS: number) {
			const dt = Math.min(Math.max(dtS, MIN_FRAME_S), MAX_FRAME_S);
			const frames = dt * 60;
			const scoring = input.scoring();
			if (!scoring) heldSinceMs = 0;

			target.update(frames);
			const over = raycast();

			const snap = controller.step(dt, { onTarget: over, scoring });

			if (over) {
				if (scoring) {
					if (heldSinceMs === 0) heldSinceMs = Date.now();
					else input.onHoldTick(heldMs(Date.now()));
				}
				target.over();
			} else {
				if (scoring && heldSinceMs !== 0) {
					input.onHoldEnd(heldMs(Date.now()));
					heldSinceMs = 0;
				}
				target.out();
			}

			return {
				world: snap.world,
				changed: snap.events.includes("worldChange"),
				pace: over ? 0.25 : 1,
			};
		},
	};
}
