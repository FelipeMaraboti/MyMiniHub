import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

/**
 * AppLayout — Shell do popup tray.
 * Lê as configurações iniciais de tema e envia para o backend.
 */
export function AppLayout() {
  useEffect(() => {
    // Carregar Tema
    const savedTheme = localStorage.getItem("myminihub_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Carregar Configs de Janela
    const hideOnBlur = localStorage.getItem("myminihub_hide_on_blur") !== "false"; // Padrão: true
    const position = localStorage.getItem("myminihub_position") || "center";
    const resizable = localStorage.getItem("myminihub_resizable") === "true"; // Padrão: false

    // Sincronizar com Rust
    try {
      invoke("update_config", { position, hideOnBlur }).catch(console.error);
      getCurrentWindow().setResizable(resizable).catch(console.error);
    } catch (e) {
      console.warn("Tauri APIs indisponíveis no AppLayout.");
    }
  }, []);

  return (
    <div className="w-full h-full flex items-start justify-center p-0 bg-transparent">
      <div
        className="popup-shell w-full h-full flex flex-col overflow-hidden animate-popup-in"
        style={{ borderRadius: "var(--popup-radius)" }}
      >
        <Outlet />
      </div>
    </div>
  );
}
