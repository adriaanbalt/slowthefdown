import type { ExpoWebGLRenderingContext } from "expo-gl";
import { PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";

import { createRenderer } from "@/gl/createRenderer";

import ObjectToCatch from "./ObjectToCatch";
import Particles from "./Particles";

export interface GameEngineInput {
	pointer: Vector2;
	scoring: () => boolean;
	onHoldTick: (tenths: number) => void;
	onHoldEnd: (tenths: number) => void;
}

const MAX_FRAME_S = 0.1;
const MIN_FRAME_S = 1 / 120;
const INTERRUPTED_S = 0.5;

export interface GameEngine {
	frame(dtS: number): void;
	resetHold(): void;
	dispose(): void;
}

export function createGameEngine(gl: ExpoWebGLRenderingContext, input: GameEngineInput): GameEngine {
	const renderer = createRenderer(gl);
	const camera = new PerspectiveCamera(100, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 20000);
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

	let heldSinceMs = 0;
	const heldTenths = (now: number) => Math.ceil((now - heldSinceMs) / 100);

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
			camera.updateMatrixWorld();
			raycaster.setFromCamera(input.pointer, camera);
			const over = raycaster.intersectObjects(target.hitTargets, false).length > 0;

			if (over) {
				if (scoring) {
					if (heldSinceMs === 0) heldSinceMs = Date.now();
					else input.onHoldTick(heldTenths(Date.now()));
				}
				particles.advance(frames / 240);
				target.over();
			} else {
				if (scoring && heldSinceMs !== 0) {
					input.onHoldEnd(heldTenths(Date.now()));
					heldSinceMs = 0;
				}
				particles.advance(frames / 60);
				target.out();
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
