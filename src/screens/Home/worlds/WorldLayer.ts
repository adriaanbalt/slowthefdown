import { Color, type Scene, type WebGLRenderer } from "three";

import { tuning } from "@/game/constants";
import type { WorldId } from "@/game/worldSchedule";

import { createWorld } from "./createWorld";
import type { World } from "./types";

export default class WorldLayer {
	target: WorldId = "particles";

	private current: World | null = null;
	private incoming: World | null = null;
	private fadeT = 1;
	private fading = false;
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
		this.current = createWorld(id);
		this.current.setOpacity(1);
		this.scene.add(this.current.object);
		this.fromBg.copy(this.current.background);
		this.toBg.copy(this.current.background);
		this.renderer.setClearColor(this.current.background, 1);
		this.fading = false;
		this.fadeT = 1;
		this.incoming = null;
	}

	transitionTo(id: WorldId) {
		if (id === this.target) return;

		if (this.fading && this.incoming) {
			if (this.current) {
				this.scene.remove(this.current.object);
				this.current.dispose();
			}
			this.current = this.incoming;
			this.incoming = null;
			this.fromBg.copy(this.current.background);
		} else if (this.current) {
			this.fromBg.copy(this.current.background);
		}

		this.target = id;
		this.incoming = createWorld(id);
		this.incoming.setOpacity(0);
		this.scene.add(this.incoming.object);
		this.toBg.copy(this.incoming.background);
		this.fadeT = 0;
		this.fading = true;
	}

	update(dtS: number, pace: number) {
		if (this.fading && this.incoming) {
			const duration = Math.max(0.05, tuning.worldFadeS);
			this.fadeT = Math.min(1, this.fadeT + dtS / duration);
			this.incoming.setOpacity(this.fadeT);
			if (this.current) this.current.setOpacity(1 - this.fadeT);
			this.lerpedBg.copy(this.fromBg).lerp(this.toBg, this.fadeT);
			this.renderer.setClearColor(this.lerpedBg, 1);

			if (this.fadeT >= 1) {
				if (this.current) {
					this.scene.remove(this.current.object);
					this.current.dispose();
				}
				this.current = this.incoming;
				this.incoming = null;
				this.fading = false;
				this.current.setOpacity(1);
				this.renderer.setClearColor(this.current.background, 1);
			}
		}

		if (this.current) this.current.update(dtS, pace);
		if (this.incoming) this.incoming.update(dtS, pace);
	}

	dispose() {
		this.clearLive();
	}

	private clearLive() {
		if (this.current) {
			this.scene.remove(this.current.object);
			this.current.dispose();
			this.current = null;
		}
		if (this.incoming) {
			this.scene.remove(this.incoming.object);
			this.incoming.dispose();
			this.incoming = null;
		}
		this.fading = false;
	}
}
