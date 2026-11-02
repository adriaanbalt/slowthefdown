import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { WorldId } from "@/game/worldSchedule";

export type GameMode = "classic" | "focus";

interface SettingsState {
	hydrated: boolean;
	/** Cold-start mode after launch. */
	defaultMode: GameMode;
	/** Active play mode for this session. */
	sessionMode: GameMode;
	/** True after the first applyDefaultOnLaunch this process. */
	launchApplied: boolean;
	/** World every run opens on; null keeps the default order. */
	startWorld: WorldId | null;
	setStartWorld: (world: WorldId | null) => void;
	setDefaultMode: (mode: GameMode) => void;
	setSessionMode: (mode: GameMode) => void;
	applyDefaultOnLaunch: () => void;
	setHydrated: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, get) => ({
			hydrated: false,
			defaultMode: "classic",
			sessionMode: "classic",
			launchApplied: false,
			startWorld: null,

			setStartWorld: (world) => set({ startWorld: world }),

			setDefaultMode: (mode) => set({ defaultMode: mode }),

			setSessionMode: (mode) => {
				if (get().sessionMode !== mode) set({ sessionMode: mode });
			},

			applyDefaultOnLaunch: () => {
				if (get().launchApplied) return;
				set({ sessionMode: get().defaultMode, launchApplied: true });
			},

			setHydrated: (value) => set({ hydrated: value }),
		}),
		{
			name: "stfd-settings",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ defaultMode: s.defaultMode, startWorld: s.startWorld }),
			onRehydrateStorage: () => (state, error) => {
				if (error) console.warn("settings hydrate failed", error);
				useSettingsStore.getState().setHydrated(true);
			},
		},
	),
);
