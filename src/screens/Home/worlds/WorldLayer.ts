import { Color, Group, type Scene, type WebGLRenderer } from "three";

import { tuning } from "@/game/constants";
import type { WorldId } from "@/game/worldSchedule";

import { createWorld } from "./createWorld";
import type { World } from "./types";

// Older layers dim by STACK_DECAY per layer above them but never below STACK_FLOOR.
const STACK_DECAY = 0.6;
const STACK_FLOOR = 0.3;
// every live layer updates each frame, so the oldest is dropped past this
const MAX_LAYERS = 6;
// below the target F (renderOrder 0); later layers draw over earlier ones
const STACK_BASE_ORDER = -100;

interface Layer {
	id: WorldId;
	world: World;
	container: Group;
	opacity: number;
}

// Worlds stack: each new world fades in on top while the ones before it stay,
// dimmed, and keep animating underneath.
export default class WorldLayer {
	target: WorldId = "particles";

	// bottom (oldest) to top (newest)
	private layers: Layer[] = [];
	private bgT = 1;
	private readonly fromBg = new Color(0x000000);
	private readonly toBg = new Color(0x000000);
	private readonly lerpedBg = new Color(0x000000);

	constructor(
		private readonly scene: Scene,
		private readonly renderer: WebGLRenderer,
	) {}

	show(id: WorldId) {
		this.clearLive();
		this.target = id;
		const layer = this.addLayer(id);
		layer.opacity = 1;
		layer.world.setOpacity(1);
		this.fromBg.copy(layer.world.background);
		this.toBg.copy(layer.world.background);
		this.bgT = 1;
		this.renderer.setClearColor(layer.world.background, 1);
	}

	transitionTo(id: WorldId) {
		if (id === this.target) return;
		this.target = id;

		this.fromBg.copy(this.lerpedBg.copy(this.fromBg).lerp(this.toBg, this.bgT));
		this.bgT = 0;

		const existing = this.layers.findIndex((l) => l.id === id);
		if (existing >= 0) {
			const [layer] = this.layers.splice(existing, 1);
			if (layer) this.layers.push(layer);
		} else {
			this.addLayer(id);
		}
		this.applyRenderOrder();

		const top = this.layers[this.layers.length - 1];
		if (top) this.toBg.copy(top.world.background);
	}

	update(dtS: number, pace: number) {
		const step = dtS / Math.max(0.05, tuning.worldFadeS);
		const topIndex = this.layers.length - 1;

		for (let i = 0; i < this.layers.length; i++) {
			const layer = this.layers[i];
			if (!layer) continue;
			const depth = topIndex - i;
			const goal = depth === 0 ? 1 : Math.max(STACK_FLOOR, STACK_DECAY ** depth);
			if (layer.opacity < goal) layer.opacity = Math.min(goal, layer.opacity + step);
			else if (layer.opacity > goal) layer.opacity = Math.max(goal, layer.opacity - step);
			layer.world.setOpacity(layer.opacity);
			layer.world.update(dtS, pace);
		}

		if (this.bgT < 1) {
			this.bgT = Math.min(1, this.bgT + step);
			this.lerpedBg.copy(this.fromBg).lerp(this.toBg, this.bgT);
			this.renderer.setClearColor(this.lerpedBg, 1);
		}
	}

	dispose() {
		this.clearLive();
	}

	private addLayer(id: WorldId): Layer {
		const world = createWorld(id);
		world.setOpacity(0);
		const container = new Group();
		container.add(world.object);
		this.scene.add(container);
		const layer: Layer = { id, world, container, opacity: 0 };
		this.layers.push(layer);
		while (this.layers.length > MAX_LAYERS) {
			const oldest = this.layers.shift();
			if (oldest) this.removeLayer(oldest);
		}
		this.applyRenderOrder();
		return layer;
	}

	// three sorts transparent objects by their nearest Group's renderOrder
	// first, so every Group in a layer carries the layer's order
	private applyRenderOrder() {
		this.layers.forEach((layer, i) => {
			const order = STACK_BASE_ORDER + i;
			layer.container.traverse((o) => {
				if (o instanceof Group) o.renderOrder = order;
			});
		});
	}

	private removeLayer(layer: Layer) {
		this.scene.remove(layer.container);
		layer.world.dispose();
	}

	private clearLive() {
		for (const layer of this.layers) this.removeLayer(layer);
		this.layers = [];
	}
}
