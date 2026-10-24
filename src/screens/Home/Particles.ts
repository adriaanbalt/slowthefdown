import {
	BufferAttribute,
	BufferGeometry,
	Color,
	DoubleSide,
	MathUtils,
	Mesh,
	ShaderMaterial,
	TetrahedronGeometry,
} from "three";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uDuration;
uniform float uScale;
attribute float aOffset;
attribute vec3 aStartPosition;
attribute vec3 aEndPosition;

void main() {
	float tProgress = mod(uTime + aOffset, uDuration) / uDuration;
	vec3 transformed = position;
	transformed.z *= uScale;
	transformed += mix(aStartPosition, aEndPosition, tProgress);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;

void main() {
	gl_FragColor = vec4(uColor, 1.0);
}
`;

export interface ParticlesOptions {
	width: number;
	height: number;
	depth: number;
	count: number;
	size: number;
	color: number;
	scale: number;
}

/**
 * Streaks flying toward the camera. Replaces the three-bas prefab version: every streak is the
 * same tetrahedron stretched along z by `scale`, moving from depth -d/2 to +d/2 on a loop.
 */
export default class Particles {
	readonly mesh: Mesh;
	private readonly geometry: BufferGeometry;
	private readonly material: ShaderMaterial;

	constructor({ width, height, depth, count, size, color, scale }: ParticlesOptions) {
		const prefab = new TetrahedronGeometry(size);
		const prefabPositions = prefab.getAttribute("position");
		const vertsPerPrefab = prefabPositions.count;
		const total = vertsPerPrefab * count;

		const position = new Float32Array(total * 3);
		const offset = new Float32Array(total);
		const start = new Float32Array(total * 3);
		const end = new Float32Array(total * 3);

		for (let i = 0; i < count; i++) {
			const x = MathUtils.randFloatSpread(width);
			const y = MathUtils.randFloat(0, height);
			for (let j = 0; j < vertsPerPrefab; j++) {
				const v = i * vertsPerPrefab + j;
				position[v * 3] = prefabPositions.getX(j);
				position[v * 3 + 1] = prefabPositions.getY(j);
				position[v * 3 + 2] = prefabPositions.getZ(j);
				offset[v] = i / count;
				start[v * 3] = x;
				start[v * 3 + 1] = y;
				start[v * 3 + 2] = depth * -0.5;
				end[v * 3] = x;
				end[v * 3 + 1] = y;
				end[v * 3 + 2] = depth * 0.5;
			}
		}
		prefab.dispose();

		this.geometry = new BufferGeometry();
		this.geometry.setAttribute("position", new BufferAttribute(position, 3));
		this.geometry.setAttribute("aOffset", new BufferAttribute(offset, 1));
		this.geometry.setAttribute("aStartPosition", new BufferAttribute(start, 3));
		this.geometry.setAttribute("aEndPosition", new BufferAttribute(end, 3));

		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			side: DoubleSide,
			uniforms: {
				uTime: { value: 0 },
				uDuration: { value: 1 },
				uScale: { value: scale },
				uColor: { value: new Color(color) },
			},
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
	}

	advance(delta: number) {
		const uTime = this.material.uniforms.uTime;
		if (uTime) uTime.value += delta;
	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}
}
