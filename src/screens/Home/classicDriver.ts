import type { Vector2 } from "three";
import type { PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";
import type { ExpoWebGLRenderingContext } from "expo-gl";

import type ObjectToCatch from "./ObjectToCatch";
import type Particles from "./Particles";

export interface ClassicDriverInput {
	pointer: Vector2;
	scoring: () => boolean;
	onHoldTick: (ms: number) => void;
	onHoldEnd: (ms: number) => void;
}

export interface ClassicDriver {
	frame(dtS: number): void;
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
	particles: Particles,
	input: ClassicDriverInput,
	raycast: () => boolean,
): ClassicDriver {
	let heldSinceMs = 0;
	const heldMs = (now: number) => now - heldSinceMs;

	return {
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

			if (over) {
				if (scoring) {
					if (heldSinceMs === 0) heldSinceMs = Date.now();
					else input.onHoldTick(heldMs(Date.now()));
				}
				particles.advance(frames / 240);
				target.over();
			} else {
				if (scoring && heldSinceMs !== 0) {
					input.onHoldEnd(heldMs(Date.now()));
					heldSinceMs = 0;
				}
				particles.advance(frames / 60);
				target.out();
			}
		},
	};
}
