import { Outlet } from "react-router-dom";

/**
 * AppLayout — Shell do popup tray.
 * A janela fecha via: clique no tray icon ou Esc na SearchBar.
 * O hide-on-blur foi removido do frontend pois causava fechamento
 * ao arrastar (webview perde foco durante drag).
 */
export function AppLayout() {
  return (
    <div className="w-full h-full flex items-start justify-center p-0">
      <div
        className="popup-shell w-full h-full flex flex-col overflow-hidden animate-popup-in"
        style={{ borderRadius: "var(--popup-radius)" }}
      >
        <Outlet />
      </div>
    </div>
  );
}
