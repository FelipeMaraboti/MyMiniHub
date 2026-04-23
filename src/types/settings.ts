// === Theme ===
export type Theme = "dark" | "system";
export type Language = "pt-BR" | "en-US";

// === User Settings ===
export interface UserSettings {
  theme: Theme;
  language: Language;
  shortcutsEnabled: boolean;
  launchOnStartup: boolean;
  sidebarCollapsed: boolean;
  updatedAt: string;
}

// === Default settings ===
export const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  language: "pt-BR",
  shortcutsEnabled: true,
  launchOnStartup: false,
  sidebarCollapsed: false,
  updatedAt: new Date().toISOString(),
};
