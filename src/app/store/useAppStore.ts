import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";

interface AppState {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (partial) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
            updatedAt: new Date().toISOString(),
          },
        })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: "minihub-app-settings",
    }
  )
);
