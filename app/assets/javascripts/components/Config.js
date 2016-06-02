export default {

	textures: {
		cloud: "assets/images/textures/cloud.png",
		stars: "assets/images/textures/stars.jpg"
	},

	speed: {
		mobile:{
			letter: {
				slow: .5,
				fast: 1.5
			},
			vortex: {
				slow: .5,
				fast: 1.5
			}
		},
		desktop:{
			letter: {
				slow: .5,
				fast: 1.5
			},
			vortex: {
				slow: .5,
				fast: 1.5
			}
		}
	},

	letter: {
		color: 0xFFFFFF,
		text: "F",
		font: "/assets/fonts/helvetiker_bold.typeface.js",
		mobile:{
			velocity: 0.01,
			noiseAccum: 0,
			speed: 1.5,
			fontsize: 70,
			size: 70,
			height: 10,
			curveSegments: 4,
			bevelThickness: 1,
			bevelSize: 0,
			bevelEnabled: true,
			material: 0,
			extrudeMaterial: 0
		},
		desktop:{
			velocity: 0.01,
			noiseAccum: 0,
			speed: 1.5,
			fontsize: 70,
			size: 70,
			height: 10,
			curveSegments: 4,
			bevelThickness: 1,
			bevelSize: 0,
			bevelEnabled: true,
			material: 0,
			extrudeMaterial: 0
		}
	},

	vortex: {
		distance: 5,
		z: -1000
	}
};
