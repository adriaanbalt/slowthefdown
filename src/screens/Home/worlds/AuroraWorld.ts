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

// Tunables — worlds run at pace 0.25 while the F is held; speeds stay visible there.
const LAYER_COUNT = 9;
const Z_FAR = -90;
const Z_NEAR = 10;
const TRAVEL_SPEED = 0.35;
const WAVE_TEMPO = 4;
const WAVE_AMP = 1;
const RIBBON_WIDTH = 140;
const RIBBON_HEIGHT = 30;
const CURVE_DEPTH = 18;

const COLORS = [0x3dffa0, 0x2fd6ff, 0x8f5cff];

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uTravel;
uniform float uPhase;
uniform float uOffset;
uniform float uWaveAmp;
uniform float uZFar;
uniform float uZNear;
uniform float uCurveDepth;
uniform float uHalfWidth;
varying vec2 vUv;
varying float vT;

void main() {
	vUv = uv;
	vec3 p = position;

	float t = fract(uTravel + uOffset);
	vT = t;
	float zBase = mix(uZFar, uZNear, t);

	// Half-pipe: sides wrap toward the viewer so layers read as a corridor.
	float curve = abs(p.x) / max(uHalfWidth, 0.001);
	p.z = zBase + curve * curve * uCurveDepth;

	// Depth-scaled sway — nearer layers move more.
	float depthAmp = mix(0.45, 1.35, t) * uWaveAmp;
	float w1 = sin(p.x * 0.12 + uTime * 0.7 + uPhase) * 2.4 * depthAmp;
	float w2 = sin(p.x * 0.28 + uTime * 1.1 + uPhase * 1.7) * 1.2 * depthAmp;
	p.y += w1 + w2;
	p.z += cos(p.x * 0.1 + uTime * 0.5 + uPhase) * 1.5 * depthAmp;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
varying float vT;

void main() {
	float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
	// Fade in far away and out before hitting the camera.
	float loopFade = smoothstep(0.0, 0.15, vT) * smoothstep(1.0, 0.8, vT);
	// Dim far layers so additive stacks do not blow out near the center.
	float depthBright = mix(0.4, 1.0, smoothstep(0.0, 0.55, vT));
	float a = edge * loopFade * depthBright * uOpacity * 0.5;
	if (a < 0.01) discard;
	gl_FragColor = vec4(uColor, a);
}
`;

interface LayerSpec {
	color: number;
	y: number;
	x: number;
	phase: number;
	offset: number;
	rotZ: number;
}

function buildLayers(count: number): LayerSpec[] {
	const layers: LayerSpec[] = [];
	for (let i = 0; i < count; i++) {
		const t = i / count;
		layers.push({
			color: COLORS[i % COLORS.length] ?? 0x3dffa0,
			y: ((i % 3) - 1) * 7 + Math.sin(i * 1.7) * 2.5,
			x: Math.sin(i * 2.3) * 8,
			phase: t * Math.PI * 2 * 1.7,
			offset: t,
			rotZ: ((i % 5) - 2) * 0.04,
		});
	}
	return layers;
}

export default class AuroraWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x020611);
	private readonly materials: ShaderMaterial[] = [];
	private readonly disposables: { dispose(): void }[] = [];

	constructor() {
		const group = new Group();
		group.renderOrder = -1;

		// Shared geometry across layers; per-layer diffs live in uniforms / mesh transform.
		const geometry = new PlaneGeometry(RIBBON_WIDTH, RIBBON_HEIGHT, 128, 16);
		this.disposables.push(geometry);

		for (const layer of buildLayers(LAYER_COUNT)) {
			const material = new ShaderMaterial({
				vertexShader,
				fragmentShader,
				transparent: true,
				depthWrite: false,
				side: DoubleSide,
				blending: AdditiveBlending,
				uniforms: {
					uTime: { value: 0 },
					uTravel: { value: 0 },
					uPhase: { value: layer.phase },
					uOffset: { value: layer.offset },
					uWaveAmp: { value: WAVE_AMP },
					uZFar: { value: Z_FAR },
					uZNear: { value: Z_NEAR },
					uCurveDepth: { value: CURVE_DEPTH },
					uHalfWidth: { value: RIBBON_WIDTH * 0.5 },
					uColor: { value: new Color(layer.color) },
					uOpacity: { value: 1 },
				},
			});
			const mesh = new Mesh(geometry, material);
			mesh.position.set(layer.x, layer.y, 0);
			mesh.rotation.z = layer.rotZ;
			mesh.renderOrder = -1;
			mesh.frustumCulled = false;
			group.add(mesh);
			this.materials.push(material);
			this.disposables.push(material);
		}

		this.object = group;
	}

	update(dtS: number, pace: number) {
		const waveStep = dtS * pace * WAVE_TEMPO;
		const travelStep = dtS * pace * TRAVEL_SPEED;
		for (const material of this.materials) {
			const uTime = material.uniforms.uTime;
			const uTravel = material.uniforms.uTravel;
			if (uTime) uTime.value += waveStep;
			if (uTravel) uTravel.value += travelStep;
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
