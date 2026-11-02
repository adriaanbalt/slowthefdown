import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Points,
	ShaderMaterial,
	type Object3D,
} from "three";

import type { World } from "./types";

const RAYS = 72;
const DOTS_PER_RAY = 48;
const COUNT = RAYS * DOTS_PER_RAY;
const RIM = 30;
const DEPTH_Z = -20;
// worlds run at pace 0.25 while the F is held; this keeps the flight visible there
const TEMPO = 3;
// full trips along a ray per second at pace 1
const FLOW = 0.12;
const SPIN = 0.05;
const WOBBLE = 0.6;
const TAU = Math.PI * 2;

const vertexShader = /* glsl */ `
attribute float aRay;
attribute float aSlot;
uniform float uPhase;
uniform float uSpin;
uniform float uWobble;
varying vec3 vColor;
varying float vFade;

vec3 hsv(float h, float s, float v) {
	vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
	return v * mix(vec3(1.0), k, s);
}

void main() {
	// 0 = far at the vanishing point, 1 = at the viewer
	float u = fract(aSlot + uPhase);
	float r = ${RIM.toFixed(1)} * pow(u, 2.3);
	float angle = aRay * ${TAU.toFixed(5)} + uSpin + 2.6 * (1.0 - u) * (1.0 - u) * 3.0;

	// the vanishing point drifts; the drift fades out toward the viewer
	vec2 centre = vec2(sin(uWobble), cos(uWobble * 2.0) * 0.7) * 2.2 * (1.0 - u);
	vec3 pos = vec3(cos(angle) * r + centre.x, sin(angle) * r + centre.y, ${DEPTH_Z.toFixed(1)});

	vec4 mv = modelViewMatrix * vec4(pos, 1.0);
	gl_Position = projectionMatrix * mv;
	gl_PointSize = mix(0.5, 5.5, u * u) * (80.0 / max(1.0, -mv.z));

	vColor = hsv(fract(aRay + uSpin / ${TAU.toFixed(5)}), 0.95, 1.0);
	vFade = smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.93, 1.0, u));
}
`;

const fragmentShader = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vFade;

void main() {
	float d = length(gl_PointCoord - 0.5) * 2.0;
	if (d > 1.0) discard;
	float halo = pow(1.0 - d, 2.0);
	float core = smoothstep(0.45, 0.0, d);
	// additive blending plus a white core blows overlapping dots out like bloom
	vec3 color = mix(vColor, vec3(1.0), core * 0.75);
	gl_FragColor = vec4(color, halo * vFade * uOpacity);
}
`;

// A rainbow tunnel: rings of glowing dots stream along spiral rays toward the viewer.
export default class WormholeWorld implements World {
	readonly object: Object3D;
	readonly background = new Color(0x000000);
	private readonly geometry: BufferGeometry;
	private readonly material: ShaderMaterial;
	private phase = 0;
	private spin = 0;
	private wobble = 0;

	constructor() {
		const rays = new Float32Array(COUNT);
		const slots = new Float32Array(COUNT);
		for (let i = 0; i < RAYS; i++) {
			for (let j = 0; j < DOTS_PER_RAY; j++) {
				const k = i * DOTS_PER_RAY + j;
				rays[k] = i / RAYS;
				// odd rays sit half a step off so the dots read as a staggered pattern
				slots[k] = (j + (i % 2) * 0.5) / DOTS_PER_RAY;
			}
		}

		this.geometry = new BufferGeometry();
		// three needs a position attribute for the draw count; the shader places the dots
		this.geometry.setAttribute("position", new BufferAttribute(new Float32Array(COUNT * 3), 3));
		this.geometry.setAttribute("aRay", new BufferAttribute(rays, 1));
		this.geometry.setAttribute("aSlot", new BufferAttribute(slots, 1));

		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending,
			uniforms: {
				uOpacity: { value: 1 },
				uPhase: { value: 0 },
				uSpin: { value: 0 },
				uWobble: { value: 0 },
			},
		});

		const points = new Points(this.geometry, this.material);
		points.frustumCulled = false;
		points.renderOrder = -1;
		this.object = points;
	}

	update(dtS: number, pace: number) {
		const dt = dtS * pace * TEMPO;
		// each counter wraps at a value the shader treats as seamless, so floats stay precise
		this.phase = (this.phase + dt * FLOW) % 1;
		this.spin = (this.spin + dt * SPIN * TAU) % TAU;
		this.wobble = (this.wobble + dt * WOBBLE) % TAU;
		const u = this.material.uniforms;
		if (u.uPhase) u.uPhase.value = this.phase;
		if (u.uSpin) u.uSpin.value = this.spin;
		if (u.uWobble) u.uWobble.value = this.wobble;
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
