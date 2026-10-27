import {
	AdditiveBlending,
	Color,
	DoubleSide,
	Group,
	Mesh,
	PlaneGeometry,
	ShaderMaterial,
	type Object3D,
} from "three";

import type { World } from "./types";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPhase;
varying vec2 vUv;

void main() {
	vUv = uv;
	vec3 p = position;
	float w1 = sin(p.x * 0.15 + uTime * 0.7 + uPhase) * 2.4;
	float w2 = sin(p.x * 0.35 + uTime * 1.1 + uPhase * 1.7) * 1.2;
	p.y += w1 + w2;
	p.z += cos(p.x * 0.1 + uTime * 0.5 + uPhase) * 1.5;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;

void main() {
	float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
	float a = edge * uOpacity * 0.55;
	if (a < 0.01) discard;
	gl_FragColor = vec4(uColor, a);
}
`;

const RIBBONS: { color: number; y: number; phase: number }[] = [
	{ color: 0x3dffa0, y: 6, phase: 0 },
	{ color: 0x2fd6ff, y: 0, phase: 2.1 },
	{ color: 0x8f5cff, y: -6, phase: 4.2 },
];

export default class AuroraWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x020611);
	private readonly materials: ShaderMaterial[] = [];
	private readonly disposables: { dispose(): void }[] = [];

	constructor() {
		const group = new Group();
		group.renderOrder = -1;

		for (const ribbon of RIBBONS) {
			const geometry = new PlaneGeometry(80, 12, 128, 8);
			const material = new ShaderMaterial({
				vertexShader,
				fragmentShader,
				transparent: true,
				depthWrite: false,
				side: DoubleSide,
				blending: AdditiveBlending,
				uniforms: {
					uTime: { value: 0 },
					uPhase: { value: ribbon.phase },
					uColor: { value: new Color(ribbon.color) },
					uOpacity: { value: 1 },
				},
			});
			const mesh = new Mesh(geometry, material);
			mesh.position.set(0, ribbon.y, -40);
			mesh.renderOrder = -1;
			group.add(mesh);
			this.materials.push(material);
			this.disposables.push(geometry, material);
		}

		this.object = group;
	}

	update(dtS: number, pace: number) {
		for (const material of this.materials) {
			const uTime = material.uniforms.uTime;
			if (uTime) uTime.value += dtS * pace;
		}
	}

	setOpacity(alpha: number) {
		for (const material of this.materials) {
			const uOpacity = material.uniforms.uOpacity;
			if (uOpacity) uOpacity.value = alpha;
		}
	}

	dispose() {
		for (const d of this.disposables) d.dispose();
	}
}
