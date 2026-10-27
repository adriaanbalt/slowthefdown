import type { ExpoWebGLRenderingContext } from "expo-gl";
import type { PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";

import { tuning } from "@/game/constants";
import { RunController, type RunSnapshot } from "@/game/RunController";

import type { DriverFrame } from "./classicDriver";
import type ObjectToCatch from "./ObjectToCatch";

export interface FocusDriverInput {
	scoring: () => boolean;
	onHud: (snap: RunSnapshot) => void;
	onRunEnd: (snap: RunSnapshot) => void;
}

export interface FocusDriver {
	frame(dtS: number, onTarget: boolean, touching: boolean): DriverFrame;
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

			let pace = 1;
			if (snap.phase === "running" && onTarget) pace = 0.25;
			else if (snap.phase === "running") pace = 1 + (1 - snap.focus);

			input.onHud(snap);

			if (snap.events.includes("runEnd") && !endedHandled) {
				endedHandled = true;
				input.onRunEnd(snap);
			}
			if (snap.phase === "idle") endedHandled = false;
			if (snap.phase === "running") endedHandled = false;

			return {
				world: snap.world,
				changed: snap.events.includes("worldChange"),
				pace,
			};
		},
	};
}
