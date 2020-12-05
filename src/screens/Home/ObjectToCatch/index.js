import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
import SimplexNoise from "simplex-noise";
const PATH_TO_ASSETS = "../../../assets/";

export default class ObjectToCatch {
	constructor() {
		this.simplex = new SimplexNoise(Math.random);

		let geometry = new THREE.CircleGeometry(3, 20);
		let hitMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			opacity: 0.0,
			transparent: true,
		});
		const hit = new THREE.Mesh(geometry, hitMaterial);
		hit.position.set(1.5, 2, 0);
		// hit.position.z = 10

		//create a group and add the two cubes
		//These cubes can now be rotated / scaled etc as a group
		this.mesh = new THREE.Group();

		this.overProgress = 1;
		this.progress = 0;
		this.velocity = 0.005;
		// this.velocity = .04// + .0001 * (1 - window.innerWidth/2000)
		this.radius = 9;
		this.noiseAccum = 0;
		this.speed = 5;
		this.isOver = false;

		// light so you can see the object
		this.light = new THREE.AmbientLight(0xffffff);
		// this.light.position.set(0, 2, 0)
		this.mesh.add(this.light);
		this.mesh.add(hit);
		this.createText("F");

		// SVG mesh
		// const svg = await this._loadSVGMesh()
		// svg.translateX(5)
		// svg.translateY(0)
		// svg.translateZ(-150)

		// this.loadThreeSVG()

		// this.mesh.add(svg)

		// this.generateTextGeometry('F', {
		//     size: 40,
		//     height: 12,
		//     font: this.fontData,
		//     weight: 'bold',
		//     style: 'normal',
		//     curveSegments: 24,
		//     bevelSize: 2,
		//     bevelThickness: 2,
		//     bevelEnabled: true,
		//     anchor: {
		//         x: 0.5,
		//         y: 0.5,
		//         z: 0.0
		//     }
		// })

		// this.createTextFontLoader( "F" )
	}

	loadFont = () => {
		const font = require(`${PATH_TO_ASSETS}fonts/HelveticaNeueLT-Std_Bold.json`);
		return this.loadFontFromJson(font);
	};
	loadFontFromJson = (json) => new THREE.FontLoader().parse(json);

	// this one works
	createText = async (text) => {
		this.fontData = await this.loadFont();

		const textGeoDark = new THREE.TextBufferGeometry(text, {
			font: this.fontData,
			size: 4,
			height: -1000,
		});

		const textGeo = new THREE.TextBufferGeometry(text, {
			font: this.fontData,
			size: 4,
			height: 1,
		});

		const materialsDark = new THREE.MeshPhongMaterial({ color: 0x222222 });
		const textMeshDark = new THREE.Mesh(textGeoDark, materialsDark);
		textMeshDark.position.set(0, 0, 0);
		this.mesh.add(textMeshDark);
		const materials = new THREE.MeshPhongMaterial({ color: 0xffffff });
		materials.customProgramCacheKey = () => {
			console.log('materials customProgramCacheKey')
		}
		const textMesh = new THREE.Mesh(textGeo, materials);
		textMesh.position.set(0, 0, -1);
		this.mesh.add(textMesh);

		// let centerOffset =
		//     -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
		// textMesh.position.x = centerOffset
	};

	update(time, mouseX, mouseY) {
		this.noise = this.simplex.noise2D(this.progress, 0);
		this.dx = Math.cos(this.progress) * (this.radius * this.noise); //  + (Math.sin( (time * (1 * this.speed) )) * 200)  // X distance from center - movement with speed
		this.dy = Math.sin(this.progress) * (this.radius * this.noise); //  + (Math.sin( (time * (1 * this.speed) )) * 200)  // Y distance from center - movement with speed over time
		this.mesh.position.x = this.dx;
		this.mesh.position.y = this.dy;

		// this.progress += this.velocity * this.speed / time
		// console.log("this.progress", this.progress, this.overProgress)
		this.progress += this.velocity * this.speed * this.overProgress;
		// this.speed += (time / 1)
		// this.noiseAccum += 0.01 * this.noiseSpeed
	}

	getPosition() {
		return this.mesh.position;
	}

	setScale(scale) {
		this.scale.x = scale;
		this.scale.y = scale;
	}
	setVelocity(newVelocity) {
		this.velocity = newVelocity;
	}
	setSpeed(newSpeed, isOver, overProgress) {
		this.speed = newSpeed;
		this.isOver = isOver;
		this.overProgress = overProgress;
	}
	setNoiseSpeed(newSpeed) {
		this.noiseSpeed = newSpeed;
	}
	setDepth(newZ) {
		this.mesh.position.z = newZ;
	}
	setRadius(newRadius) {
		this.radius = newRadius;
	}
	over(time) {
		this.speed = 0.7;
		// to speed up while playing
		this.overProgress = 1; //time / 10000
		// this.mesh.children[0].color.setHex(0xff00ff)
	}
	out() {
		this.speed = 5;
		this.overProgress = 1;
	}
	getMesh() {
		return this.mesh;
	}
}
