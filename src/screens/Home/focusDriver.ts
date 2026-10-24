import type { ExpoWebGLRenderingContext } from "expo-gl";
import type { PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";

import { tuning } from "@/game/constants";
import { RunController, type RunSnapshot } from "@/game/RunController";

import type ObjectToCatch from "./ObjectToCatch";
import type Particles from "./Particles";

export interface FocusDriverInput {
	scoring: () => boolean;
	onHud: (snap: RunSnapshot) => void;
	onRunEnd: (snap: RunSnapshot) => void;
}

export interface FocusDriver {
	frame(dtS: number, onTarget: boolean, touching: boolean): void;
	reset(): void;
}

const MIN_FRAME_S = 1 / 120;

export function createFocusDriver(
	_gl: ExpoWebGLRenderingContext,
	_renderer: WebGLRenderer,
	_scene: Scene,
	_camera: PerspectiveCamera,
	_raycaster: Raycaster,
	target: ObjectToCatch,
	particles: Particles,
	input: FocusDriverInput,
): FocusDriver {
	const controller = new RunController();
	let endedHandled = false;

	return {
		reset() {
			controller.reset();
			target.resetFocusMotion();
			endedHandled = false;
		},
		frame(dtS: number, onTarget: boolean, touching: boolean) {
			const dt = Math.min(Math.max(dtS, MIN_FRAME_S), tuning.maxFrameS);
			const scoring = input.scoring();
			const snap = controller.step(dt, {
				onTarget: scoring && onTarget,
				touching: scoring && touching,
			});

			const easeS = onTarget ? tuning.easeCatchS : tuning.easeSlipS;
			target.updateFocus(dt, snap.targetSpeed, snap.params, easeS);

			if (snap.phase === "running" && onTarget) {
				particles.advance(dt * 0.25);
			} else if (snap.phase === "running") {
				const rate = 1 + (1 - snap.focus);
				particles.advance(dt * rate);
			} else {
				particles.advance(dt);
			}

			input.onHud(snap);

			if (snap.events.includes("runEnd") && !endedHandled) {
				endedHandled = true;
				input.onRunEnd(snap);
			}
			if (snap.phase === "idle") endedHandled = false;
			if (snap.phase === "running") endedHandled = false;
		},
	};
}
