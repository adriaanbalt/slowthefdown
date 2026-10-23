import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import { CircleGeometry, Group, Mesh, MeshBasicMaterial, type Object3D } from "three";
import { Font, type FontData } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import fontJson from "@/assets/fonts/HelveticaNeueLT-Std_Bold.json";

// Values from the SDK 39 app. Speeds are per 60 Hz frame.
const MAX_SPEED = 5;
const MIN_SPEED = 0.7;
const VELOCITY = 0.005;
const RADIUS = 9;
const HIT_RADIUS = 4;
const TEXT_SIZE = 4;
const TEXT_OFFSET = { x: -1.75, y: -5 };

export default class ObjectToCatch {
	readonly mesh: Group;
	private readonly noise2D: NoiseFunction2D;
	private readonly disposables: { dispose(): void }[] = [];
	private progress = 0;
	private speed = MAX_SPEED;

	constructor() {
		this.noise2D = createNoise2D();
		this.mesh = new Group();

		const hitGeometry = new CircleGeometry(HIT_RADIUS, 100);
		const hitMaterial = new MeshBasicMaterial({ color: 0x000000, opacity: 0.00001, transparent: true });
		this.mesh.add(new Mesh(hitGeometry, hitMaterial));

		const font = new Font(fontJson as unknown as FontData);
		const faceGeometry = new TextGeometry("F", { font, size: TEXT_SIZE, depth: 1 });
		const tailGeometry = new TextGeometry("F", { font, size: TEXT_SIZE, depth: -1000 });
		// The old Phong materials were lit only by a full-strength AmbientLight, which is a flat colour.
		const faceMaterial = new MeshBasicMaterial({ color: 0xffffff });
		const tailMaterial = new MeshBasicMaterial({ color: 0x222222 });

		const tail = new Mesh(tailGeometry, tailMaterial);
		const face = new Mesh(faceGeometry, faceMaterial);
		tail.position.set(TEXT_OFFSET.x, TEXT_OFFSET.y, 0);
		face.position.set(TEXT_OFFSET.x, TEXT_OFFSET.y, 0);
		this.mesh.add(face, tail);

		this.disposables.push(hitGeometry, hitMaterial, faceGeometry, tailGeometry, faceMaterial, tailMaterial);
	}

	/** Every mesh the finger can hit, matching the old recursive raycast. */
	get hitTargets(): Object3D[] {
		return this.mesh.children;
	}

	update(frames: number) {
		const n = this.noise2D(this.progress, 0);
		this.mesh.position.x = Math.cos(this.progress) * RADIUS * n;
		this.mesh.position.y = Math.sin(this.progress) * RADIUS * n;
		this.progress += VELOCITY * this.speed * frames;
	}

	over() {
		this.speed = MIN_SPEED;
	}

	out() {
		this.speed = MAX_SPEED;
	}

	dispose() {
		for (const d of this.disposables) d.dispose();
	}
}
