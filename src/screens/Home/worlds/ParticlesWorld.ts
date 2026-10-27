import { Color, type Object3D } from "three";

import Particles from "../Particles";
import type { World } from "./types";

export default class ParticlesWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x000000);
	private readonly particles: Particles;

	constructor() {
		this.particles = new Particles({
			width: 40,
			height: 40,
			depth: 40,
			count: 3000,
			size: 0.005,
			color: 0xffffff,
			scale: 1000,
		});
		this.particles.mesh.position.y = -15;
		this.particles.mesh.renderOrder = -1;
		this.object = this.particles.mesh;
	}

	update(dtS: number, pace: number) {
		this.particles.advance(dtS * pace);
	}

	setOpacity(alpha: number) {
		this.particles.setOpacity(alpha);
	}

	dispose() {
		this.particles.dispose();
	}
}
