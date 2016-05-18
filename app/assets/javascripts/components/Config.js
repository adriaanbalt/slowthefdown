export default {

	textures: {
		adriaan: "textures/adriaan.jpg",
		stars: "textures/stars.jpg"
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
	}

	letter: {
		mobile:{
			text: "F",
			color: "0xFFFFFF",
			progress: 0 ,
			velocity: 0.01,
			radius: 500,
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
			text: "F",
			color: "0xFFFFFF",
			progress: 0 ,
			velocity: 0.01,
			radius: 500,
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
		distance: 5
		z: -1000
	}
};
