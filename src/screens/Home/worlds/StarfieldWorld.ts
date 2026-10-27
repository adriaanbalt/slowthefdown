import {
	BufferAttribute,
	BufferGeometry,
	Color,
	MathUtils,
	Points,
	ShaderMaterial,
	type Object3D,
} from "three";

import type { World } from "./types";

const COUNT = 4000;
const DEPTH = 80;

const vertexShader = /* glsl */ `
attribute float aPhase;
attribute float aSize;
uniform float uTime;
varying float vTwinkle;

void main() {
	vTwinkle = 0.55 + 0.45 * sin(uTime * 1.4 + aPhase);
	vec4 mv = modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = aSize * (120.0 / max(1.0, -mv.z));
	gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uOpacity;
varying float vTwinkle;

void main() {
	vec2 c = gl_PointCoord - 0.5;
	float d = length(c);
	if (d > 0.5) discard;
	float a = smoothstep(0.5, 0.0, d) * vTwinkle * uOpacity;
	gl_FragColor = vec4(1.0, 1.0, 1.0, a);
}
`;

export default class StarfieldWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x000005);
	private readonly geometry: BufferGeometry;
	private readonly material: ShaderMaterial;
	private readonly positions: Float32Array;
	private readonly posAttr: BufferAttribute;

	constructor() {
		this.positions = new Float32Array(COUNT * 3);
		const phases = new Float32Array(COUNT);
		const sizes = new Float32Array(COUNT);

		for (let i = 0; i < COUNT; i++) {
			this.positions[i * 3] = MathUtils.randFloatSpread(60);
			this.positions[i * 3 + 1] = MathUtils.randFloatSpread(50);
			this.positions[i * 3 + 2] = MathUtils.randFloat(-DEPTH, -5);
			phases[i] = Math.random() * Math.PI * 2;
			sizes[i] = MathUtils.randFloat(0.6, 2.2);
		}

		this.geometry = new BufferGeometry();
		this.posAttr = new BufferAttribute(this.positions, 3);
		this.geometry.setAttribute("position", this.posAttr);
		this.geometry.setAttribute("aPhase", new BufferAttribute(phases, 1));
		this.geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));

		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uTime: { value: 0 },
				uOpacity: { value: 1 },
			},
		});

		const points = new Points(this.geometry, this.material);
		points.frustumCulled = false;
		points.renderOrder = -1;
		this.object = points;
	}

	update(dtS: number, pace: number) {
		const uTime = this.material.uniforms.uTime;
		if (uTime) uTime.value += dtS * pace;
		const drift = dtS * pace * 4;
		for (let i = 0; i < COUNT; i++) {
			const zi = i * 3 + 2;
			let z = (this.positions[zi] ?? 0) + drift;
			if (z > -5) z = -DEPTH;
			this.positions[zi] = z;
		}
		this.posAttr.needsUpdate = true;
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
