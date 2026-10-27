import {
	isRotationWorld,
	type RotationWorldId,
	type WorldId,
} from "@/game/worldSchedule";

import AuroraWorld from "./AuroraWorld";
import CausticsWorld from "./CausticsWorld";
import InkWorld from "./InkWorld";
import ParticlesWorld from "./ParticlesWorld";
import StarfieldWorld from "./StarfieldWorld";
import VortexWorld from "./VortexWorld";
import type { World } from "./types";

const WORLD_FACTORIES: Record<RotationWorldId, () => World> = {
	particles: () => new ParticlesWorld(),
	ink: () => new InkWorld(),
	starfield: () => new StarfieldWorld(),
	aurora: () => new AuroraWorld(),
	vortex: () => new VortexWorld(),
	caustics: () => new CausticsWorld(),
};

export function createWorld(id: WorldId): World {
	if (isRotationWorld(id)) return WORLD_FACTORIES[id]();
	return new ParticlesWorld();
}
