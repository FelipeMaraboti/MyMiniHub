import { createHashRouter, RouterProvider } from "react-router-dom";

// Layouts
import { AppLayout } from "@/app/layouts/AppLayout";

// Main popup page
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage";

// Tool window (secondary window)
import { ToolWindowShell } from "@/modules/dashboard/pages/ToolWindowShell";

/**
 * Usa createHashRouter porque o Tauri abre janelas secundárias
 * via URL com hash (/#/tool/:id).
 */
const router = createHashRouter([
  // ── Popup principal ─────────────────────────────
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },

  // ── Janela secundária de ferramenta ─────────────
  // Renderiza sem o AppLayout (sem popup-shell, sem hide-on-blur)
  {
    path: "/tool/:id",
    element: <ToolWindowShell />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
