import { invoke } from "@tauri-apps/api/core";
import type { Tool } from "@/types";

/**
 * Abre uma ferramenta em janela secundária dedicada.
 * Registra como recente automaticamente.
 */
export async function openToolWindow(tool: Tool): Promise<void> {
  return invoke("open_tool_window", {
    toolId: tool.id,
    toolName: tool.name,
  });
}

/**
 * Esconde o popup principal.
 */
export async function hideMainWindow(): Promise<void> {
  return invoke("hide_main_window");
}

/**
 * Toggle do popup principal.
 */
export async function toggleMainWindow(): Promise<void> {
  return invoke("toggle_main_window");
}
