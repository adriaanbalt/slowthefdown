import {
	Color,
	DoubleSide,
	Mesh,
	PlaneGeometry,
	ShaderMaterial,
	type Object3D,
} from "three";

import type { World } from "./types";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;

float caustic(vec2 p) {
	float a = sin(p.x * 6.0 + uTime * 0.8) + sin(p.y * 7.0 - uTime * 0.6);
	float b = sin((p.x + p.y) * 5.0 + uTime * 1.1);
	float c = sin((p.x - p.y) * 8.0 - uTime * 0.4);
	return a * 0.35 + b * 0.35 + c * 0.3;
}

void main() {
	vec2 p = vUv * 2.0 - 1.0;
	vec2 warped = p + 0.15 * vec2(
		sin(p.y * 4.0 + uTime * 0.5),
		cos(p.x * 4.0 - uTime * 0.4)
	);
	float v = caustic(warped);
	float glow = smoothstep(-0.2, 0.9, v);
	float a = (0.15 + glow * 0.7) * uOpacity;
	gl_FragColor = vec4(uColor * (0.4 + glow), a);
}
`;

export default class CausticsWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x001018);
	private readonly geometry: PlaneGeometry;
	private readonly material: ShaderMaterial;

	constructor() {
		this.geometry = new PlaneGeometry(90, 70);
		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			transparent: true,
			depthWrite: false,
			side: DoubleSide,
			uniforms: {
				uTime: { value: 0 },
				uOpacity: { value: 1 },
				uColor: { value: new Color(0x1fa3c9) },
			},
		});
		const mesh = new Mesh(this.geometry, this.material);
		mesh.position.set(0, 0, -30);
		mesh.renderOrder = -1;
		this.object = mesh;
	}

	update(dtS: number, pace: number) {
		const uTime = this.material.uniforms.uTime;
		if (uTime) uTime.value += dtS * pace;
	}

	setOpacity(alpha: number) {
		const uOpacity = this.material.uniforms.uOpacity;
		if (uOpacity) uOpacity.value = alpha;
	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}
}
