import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Favorite, RecentTool } from "@/types";

const MAX_RECENT = 10;

interface ToolsState {
  favorites: Favorite[];
  recents: RecentTool[];

  // Favorites
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;

  // Recents
  addRecent: (toolId: string) => void;
  clearRecents: () => void;
}

export const useToolsStore = create<ToolsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recents: [],

      addFavorite: (toolId) => {
        if (get().isFavorite(toolId)) return;
        const entry: Favorite = {
          id: crypto.randomUUID(),
          toolId,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ favorites: [...s.favorites, entry] }));
      },

      removeFavorite: (toolId) =>
        set((s) => ({
          favorites: s.favorites.filter((f) => f.toolId !== toolId),
        })),

      isFavorite: (toolId) => get().favorites.some((f) => f.toolId === toolId),

      addRecent: (toolId) => {
        const entry: RecentTool = {
          id: crypto.randomUUID(),
          toolId,
          usedAt: new Date().toISOString(),
        };
        set((s) => {
          // Remove duplicates, add to front, limit to MAX_RECENT
          const filtered = s.recents.filter((r) => r.toolId !== toolId);
          return { recents: [entry, ...filtered].slice(0, MAX_RECENT) };
        });
      },

      clearRecents: () => set({ recents: [] }),
    }),
    {
      name: "minihub-tools",
    }
  )
);
