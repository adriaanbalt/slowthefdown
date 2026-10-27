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

const COUNT = 6000;
const RIM = 28;

const vertexShader = /* glsl */ `
attribute float aRadius;
varying float vRadius;

void main() {
	vRadius = aRadius;
	vec4 mv = modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = mix(2.8, 0.8, aRadius / ${RIM.toFixed(1)}) * (80.0 / max(1.0, -mv.z));
	gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uOpacity;
varying float vRadius;

void main() {
	vec2 c = gl_PointCoord - 0.5;
	if (length(c) > 0.5) discard;
	float t = clamp(vRadius / ${RIM.toFixed(1)}, 0.0, 1.0);
	vec3 rim = vec3(0.478, 0.235, 1.0);
	vec3 core = vec3(1.0);
	vec3 color = mix(core, rim, t);
	float a = smoothstep(0.5, 0.0, length(c)) * uOpacity;
	gl_FragColor = vec4(color, a);
}
`;

export default class VortexWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x050008);
	private readonly geometry: BufferGeometry;
	private readonly material: ShaderMaterial;
	private readonly positions: Float32Array;
	private readonly radii: Float32Array;
	private readonly angles: Float32Array;
	private readonly posAttr: BufferAttribute;
	private readonly radiusAttr: BufferAttribute;

	constructor() {
		this.positions = new Float32Array(COUNT * 3);
		this.radii = new Float32Array(COUNT);
		this.angles = new Float32Array(COUNT);

		for (let i = 0; i < COUNT; i++) {
			this.radii[i] = Math.sqrt(Math.random()) * RIM;
			this.angles[i] = Math.random() * Math.PI * 2;
			this.writeParticle(i);
		}

		this.geometry = new BufferGeometry();
		this.posAttr = new BufferAttribute(this.positions, 3);
		this.radiusAttr = new BufferAttribute(this.radii, 1);
		this.geometry.setAttribute("position", this.posAttr);
		this.geometry.setAttribute("aRadius", this.radiusAttr);

		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uOpacity: { value: 1 },
			},
		});

		const points = new Points(this.geometry, this.material);
		points.frustumCulled = false;
		points.renderOrder = -1;
		this.object = points;
	}

	private writeParticle(i: number) {
		const r = this.radii[i] ?? 0;
		const a = this.angles[i] ?? 0;
		this.positions[i * 3] = Math.cos(a) * r;
		this.positions[i * 3 + 1] = Math.sin(a) * r;
		this.positions[i * 3 + 2] = -20 + (1 - r / RIM) * 8;
	}

	update(dtS: number, pace: number) {
		const dt = dtS * pace;
		for (let i = 0; i < COUNT; i++) {
			const r = this.radii[i] ?? 0;
			const omega = MathUtils.lerp(2.4, 0.35, r / RIM);
			this.angles[i] = (this.angles[i] ?? 0) + omega * dt;
			let next = r - dt * MathUtils.lerp(2.5, 0.4, r / RIM);
			if (next < 0.4) {
				next = RIM;
				this.angles[i] = Math.random() * Math.PI * 2;
			}
			this.radii[i] = next;
			this.writeParticle(i);
		}
		this.posAttr.needsUpdate = true;
		this.radiusAttr.needsUpdate = true;
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
