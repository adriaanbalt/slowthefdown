import type { ExpoWebGLRenderingContext } from "expo-gl";
import { PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";

import type { RunSnapshot } from "@/game/RunController";
import type { GameMode } from "@/state/settingsStore";
import { createRenderer } from "@/gl/createRenderer";

import { createClassicDriver, type ClassicDriver } from "./classicDriver";
import { createFocusDriver, type FocusDriver } from "./focusDriver";
import ObjectToCatch from "./ObjectToCatch";
import WorldLayer from "./worlds/WorldLayer";

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

	const worlds = new WorldLayer(scene, renderer);
	worlds.show("particles");
	const target = new ObjectToCatch();
	scene.add(target.mesh);

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
		{
			scoring: input.scoring,
			onHud: input.onFocusHud,
			onRunEnd: input.onFocusRunEnd,
		},
	);

	return {
		resetRun() {
			classic.reset();
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

			const result =
				mode === "focus"
					? focus.frame(dtS, onTarget, touching)
					: classic.frame(dtS);

			if (result.reset) worlds.revert();
			else if (result.changed) worlds.transitionTo(result.world);
			else if (result.world !== worlds.target) worlds.show(result.world);

			worlds.update(dtS, result.pace);

			renderer.render(scene, camera);
			gl.endFrameEXP();
		},
		dispose() {
			target.dispose();
			worlds.dispose();
			renderer.dispose();
		},
	};
}

export function isInterruptedFrame(gapS: number): boolean {
	return gapS > INTERRUPTED_S;
}
