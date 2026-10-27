import type { Color, Object3D } from "three";

export interface World {
	readonly object: Object3D;
	readonly background: Color;
	update(dtS: number, pace: number): void;
	setOpacity(alpha: number): void;
	dispose(): void;
}
