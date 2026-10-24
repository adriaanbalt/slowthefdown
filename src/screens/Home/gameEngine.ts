import type { ExpoWebGLRenderingContext } from "expo-gl";
import { PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";

import type { RunSnapshot } from "@/game/RunController";
import type { GameMode } from "@/state/settingsStore";
import { createRenderer } from "@/gl/createRenderer";

import { createClassicDriver, type ClassicDriver } from "./classicDriver";
import { createFocusDriver, type FocusDriver } from "./focusDriver";
import ObjectToCatch from "./ObjectToCatch";
import Particles from "./Particles";

export interface GameEngineInput {
	pointer: Vector2;
	touching: () => boolean;
	mode: () => GameMode;
	scoring: () => boolean;
	onHoldTick: (ms: number) => void;
	onHoldEnd: (ms: number) => void;
	onFocusHud: (snap: RunSnapshot) => void;
	onFocusRunEnd: (snap: RunSnapshot) => void;
}

const INTERRUPTED_S = 0.5;

export interface GameEngine {
	frame(dtS: number): void;
	/** Full reset when switching modes or leaving the Game tab. */
	resetRun(): void;
	/**
	 * Long hitch / background: classic clears the hold; focus keeps the run
	 * (FocusMeter already clamps dt via maxFrameS).
	 */
	onInterrupted(): void;
	dispose(): void;
}

export function createGameEngine(gl: ExpoWebGLRenderingContext, input: GameEngineInput): GameEngine {
	const renderer = createRenderer(gl);
	const camera = new PerspectiveCamera(
		100,
		gl.drawingBufferWidth / gl.drawingBufferHeight,
		0.1,
		20000,
	);
	camera.position.set(0, 0, 20);
	const scene = new Scene();
	const raycaster = new Raycaster();

	const particles = new Particles({
		width: 40,
		height: 40,
		depth: 40,
		count: 3000,
		size: 0.005,
		color: 0xffffff,
		scale: 1000,
	});
	particles.mesh.position.y = -15;
	const target = new ObjectToCatch();
	scene.add(particles.mesh, target.mesh);

	const raycast = () => {
		camera.updateMatrixWorld();
		raycaster.setFromCamera(input.pointer, camera);
		return raycaster.intersectObjects(target.hitTargets, false).length > 0;
	};

	const classic: ClassicDriver = createClassicDriver(
		gl,
		renderer,
		scene,
		camera,
		raycaster,
		target,
		particles,
		{
			pointer: input.pointer,
			scoring: input.scoring,
			onHoldTick: input.onHoldTick,
			onHoldEnd: input.onHoldEnd,
		},
		raycast,
	);

	const focus: FocusDriver = createFocusDriver(
		gl,
		renderer,
		scene,
		camera,
		raycaster,
		target,
		particles,
		{
			scoring: input.scoring,
			onHud: input.onFocusHud,
			onRunEnd: input.onFocusRunEnd,
		},
	);

	return {
		resetRun() {
			classic.resetHold();
			focus.reset();
		},
		onInterrupted() {
			if (input.mode() === "classic") classic.resetHold();
			// focus: do not reset — meter clamps dt; ending the run on a hitch is wrong
		},
		frame(dtS: number) {
			const mode = input.mode();
			const onTarget = raycast();
			const touching = input.touching();

			if (mode === "focus") {
				focus.frame(dtS, onTarget, touching);
			} else {
				classic.frame(dtS);
			}

			renderer.render(scene, camera);
			gl.endFrameEXP();
		},
		dispose() {
			target.dispose();
			particles.dispose();
			renderer.dispose();
		},
	};
}

export function isInterruptedFrame(gapS: number): boolean {
	return gapS > INTERRUPTED_S;
}
