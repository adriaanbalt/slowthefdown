import Level from "./Level";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
import Particles from "../Visualizations/Particles";

export default class ParticlesLevel extends Level {
	constructor(options) {
		super(options);
		// width, height, depth, prefabCount, prefabSize
		this.visualization = new Particles(40, 40, 40, 3000, 0.005, 0xffffff);
		this.visualization.setScale(1000); // 100000
		this.particlesMesh = this.visualization.getMesh();
		this.particlesMesh.position.y = -15;
	}

	getMesh() {
		return this.visualization.getMesh();
	}

	over() {
		this.visualization.update(1 / 240);
	}
	out() {
		this.visualization.update(1 / 60);
	}

	update(speed) {
		// updateParticlePositions(deltaTime);
	}

	// updateParticleRotation = (rotation) => {
	// 	this.particlesMesh.rotation.x = (25 * this.state.mouse.y * Math.PI) / 180;
	// };

	mouseAdjust = (position) => {
		// adjusting perspective of particles to make it look like it moves versus the finger
		if (position.y != -10) {
			this.particlesMesh.rotation.y = (25 * position.x * Math.PI) / 180;
		} else {
			this.particlesMesh.rotation.y = (0 * Math.PI) / 180;
		}
		if (position.x != -10) {
			this.particlesMesh.rotation.x = -(25 * position.y * Math.PI) / 180;
		} else {
			this.particlesMesh.rotation.x = (10 * Math.PI) / 180;
		}
	};
}
