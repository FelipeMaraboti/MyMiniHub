import { invoke } from "@tauri-apps/api/core";

// ============================================================
//  Tauri Bridge — Frontend service para comandos Rust
//  Abstrai os `invoke` em funções tipadas e reutilizáveis.
// ============================================================

/**
 * Verifica se a comunicação com o backend está funcionando.
 */
export async function ping(): Promise<string> {
  return invoke<string>("ping");
}

/**
 * Retorna a versão atual do app.
 */
export async function getAppVersion(): Promise<string> {
  return invoke<string>("get_app_version");
}
