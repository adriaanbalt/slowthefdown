import Level from "./Level";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4

export default class VortexLevel extends Level {
	constructor(options) {
		super(options);

		const texture = ExpoTHREE.loadTextureAsync({
			asset: require("../../../assets/images/stars.jpg"),
		});
		this.visualization = new Vortex(texture);
	}

	getMesh() {
		return this.visualization.getMesh();
	}

	over() {}

	out() {}

	mouseAdjust = (position) => {};
}
