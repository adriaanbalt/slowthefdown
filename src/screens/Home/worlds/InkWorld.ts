import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import {
	Color,
	DoubleSide,
	Group,
	MathUtils,
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
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;

void main() {
	vec2 c = vUv - 0.5;
	float r = length(c) * 2.0;
	float a = smoothstep(1.0, 0.15, r) * uOpacity;
	if (a < 0.01) discard;
	gl_FragColor = vec4(uColor, a);
}
`;

const COLORS = [0x2b2f8f, 0x11706b];
const COUNT = 40;

interface Blob {
	mesh: Mesh;
	material: ShaderMaterial;
	seedX: number;
	seedY: number;
	baseX: number;
	baseY: number;
	baseZ: number;
	speed: number;
}

export default class InkWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x05070d);
	private readonly noise2D: NoiseFunction2D;
	private readonly blobs: Blob[] = [];
	private readonly disposables: { dispose(): void }[] = [];
	private time = 0;

	constructor() {
		this.noise2D = createNoise2D();
		const group = new Group();
		group.renderOrder = -1;

		for (let i = 0; i < COUNT; i++) {
			const size = MathUtils.randFloat(8, 20);
			const geometry = new PlaneGeometry(size, size);
			const material = new ShaderMaterial({
				vertexShader,
				fragmentShader,
				transparent: true,
				depthWrite: false,
				side: DoubleSide,
				uniforms: {
					uColor: { value: new Color(COLORS[i % COLORS.length]) },
					uOpacity: { value: 1 },
				},
			});
			const mesh = new Mesh(geometry, material);
			mesh.renderOrder = -1;
			const baseX = MathUtils.randFloatSpread(50);
			const baseY = MathUtils.randFloatSpread(40);
			const baseZ = MathUtils.randFloat(-40, -10);
			mesh.position.set(baseX, baseY, baseZ);
			group.add(mesh);
			this.blobs.push({
				mesh,
				material,
				seedX: Math.random() * 100,
				seedY: Math.random() * 100,
				baseX,
				baseY,
				baseZ,
				speed: MathUtils.randFloat(0.05, 0.18),
			});
			this.disposables.push(geometry, material);
		}

		this.object = group;
	}

	update(dtS: number, pace: number) {
		this.time += dtS * pace;
		for (const blob of this.blobs) {
			const t = this.time * blob.speed;
			const dx = this.noise2D(blob.seedX + t, blob.seedY) * 6;
			const dy = this.noise2D(blob.seedX, blob.seedY + t) * 6;
			blob.mesh.position.x = blob.baseX + dx;
			blob.mesh.position.y = blob.baseY + dy;
			blob.mesh.position.z = blob.baseZ;
			blob.mesh.lookAt(0, 0, 20);
		}
	}

	setOpacity(alpha: number) {
		for (const blob of this.blobs) {
			const uOpacity = blob.material.uniforms.uOpacity;
			if (uOpacity) uOpacity.value = alpha;
		}
	}

	dispose() {
		for (const d of this.disposables) d.dispose();
	}
}
