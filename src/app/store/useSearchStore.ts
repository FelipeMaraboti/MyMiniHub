import { create } from "zustand";
import type { SearchResult } from "@/types";
import { searchTools } from "@/utils/tool-registry";

interface SearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;

  setQuery: (query: string) => void;
  setOpen: (open: boolean) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: "",
  results: [],
  isOpen: false,

  setQuery: (query) => {
    const tools = searchTools(query);
    const results: SearchResult[] = tools.map((tool) => ({
      type: "tool",
      tool,
      score: 1,
      label: tool.name,
      description: tool.description,
      route: tool.route,
    }));
    set({ query, results });
  },

  setOpen: (open) => set({ isOpen: open }),

  clearSearch: () => set({ query: "", results: [], isOpen: false }),
}));
