// === Tool Category ===
export type ToolCategory =
  | "files"
  | "images"
  | "text"
  | "devtools"
  | "productivity"
  | "system";

// === Tool definition (registry item) ===
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;            // Lucide icon name
  route: string;
  tags: string[];
  favoriteable: boolean;
  recentEnabled: boolean;
  isAvailable: boolean;    // false = coming soon
  badge?: "new" | "beta" | "soon";
}

// === Favorite entry ===
export interface Favorite {
  id: string;
  toolId: string;
  createdAt: string;
}

// === Recent tool entry ===
export interface RecentTool {
  id: string;
  toolId: string;
  usedAt: string;
}

// === Search result ===
export interface SearchResult {
  type: "tool" | "favorite" | "recent" | "note" | "action";
  tool?: Tool;
  score: number;
  label: string;
  description?: string;
  route: string;
}
