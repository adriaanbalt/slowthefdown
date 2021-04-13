import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4

export default class Vortex {
	constructor(texture) {
		// texture = this.loadTexture()
		this.shader = {
			vertexShader: `varying vec2 vUv;
                void main(){
                    vUv = uv;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
                    gl_Position = projectionMatrix * mvPosition;
                }`,
			fragmentShader: `precision highp float;
                uniform float iTime;
                uniform float iProgress;
                uniform float iWaves;
                uniform float iBrightness;
                uniform float iMouseX;
                uniform float iMouseY;
                uniform sampler2D iText0;
                uniform sampler2D iText1;
                varying vec2 vUv;
                void main() {
                    vec2 p = -1.0 + 3.0 * vUv;
                    vec2 q = p - vec2(0.5, 0.5);
                    q.x += iMouseY;
                    q.y += iMouseX;
                    float len = length(q);
                    float a = atan(q.y, q.x) / 3.1416;
                    float b = atan(q.y, q.x) / 3.1416;
                    float c = atan(q.y, q.x) / 3.1416;
                    float r1 = ((0.1 + iProgress) * iWaves) / len + iTime;
                    float r2 = ((0.1) * iWaves) / len + iTime;
                    float m = (cos(.5) + sin(.9)) / .5;
                    vec4 tex1 = texture2D(iText0, vec2(a, r1));
                    vec4 tex2 = texture2D(iText1, vec2(b, r2));
                    vec3 col = vec3(mix(tex1, tex2, m));
                    vec3 d = col * len * 0.5 * iBrightness;
                    gl_FragColor = vec4(d, 1.0);
                }`,
		};

		// const texture = await ExpoTHREE.loadAsync(someRemoteUrl);
		const backgroundGeometry = new THREE.PlaneBufferGeometry(22, 47);

		var tuniform = {
			iTime: { type: "f", value: 1 },
			iProgress: { type: "f", value: 1000 },
			iText0: { type: "t", value: texture },
			iText1: { type: "t", value: texture },
			iBrightness: { type: "f", value: 1 },
			iMouseX: { type: "f", value: -1 / 500 },
			iMouseY: { type: "f", value: -1 / 500 },
			iWaves: { type: "f", value: 1 },
		};

		tuniform.iText0.value.wrapS = tuniform.iText0.value.wrapT =
			THREE.RepeatWrapping;
		tuniform.iText1.value.wrapS = tuniform.iText1.value.wrapT =
			THREE.RepeatWrapping;

		const backgroundMaterial = new THREE.ShaderMaterial({
			uniforms: tuniform,
			vertexShader: this.shader.vertexShader,
			fragmentShader: this.shader.fragmentShader,
			side: THREE.DoubleSide,
		});

		backgroundMaterial.renderOrder = 1;
		this.mesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
		// this.mesh.position.set(0, 0, 10);

		this.shaderMat = backgroundMaterial;
		this.speed = 3;
		this.progress = 1;
	}

	loadTexture = async () => {
		return await ExpoTHREE.loadTextureAsync({
			asset: require("../../../../assets/images/stars.jpg"),
		});
	};

	getMesh() {
		return this.mesh;
	}

	over(progress, mouse) {
		// this.progress = progress
		this.shaderMat.uniforms["iWaves"].value = 10;
		this.shaderMat.uniforms["iMouseX"].value = mouse.x;
		this.shaderMat.uniforms["iMouseY"].value = mouse.y;
	}

	out() {
		this.progress = 1000;
		this.shaderMat.uniforms["iWaves"].value = 1;
		this.shaderMat.uniforms["iMouseX"].value = 0;
		this.shaderMat.uniforms["iMouseY"].value = 0;
	}

	update(time, mouseX, mouseY, textPosition) {
		const newTime = time;
		// const newSpeed = this.speed * newTime
		const newProgress = this.progress * newTime;
		this.shaderMat.uniforms["iTime"].value = newTime;
		this.shaderMat.uniforms["iProgress"].value = newProgress;
		// this.shaderMat.uniforms['iWaves'].value = this.speed;
		// this.shaderMat.uniforms['iMouseX'].value = textPosition.x / 2;
		// this.shaderMat.uniforms['iMouseY'].value = textPosition.y / 2;
		this.mesh.position.z = 0;
	}
}
