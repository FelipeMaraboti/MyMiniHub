import { useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { CategoryTabs, type TabId } from "@/components/shared/CategoryTabs";
import { ToolsList } from "@/components/shared/ToolsList";
import { PopupFooter } from "@/components/shared/PopupFooter";
import { useToolsStore } from "@/app/store";
import { openToolWindow } from "@/services/tauri/window";
import type { Tool } from "@/types";

/**
 * DashboardPage — Tela principal do popup tray.
 * Estrutura Mac-style: SearchBar → CategoryTabs → ToolsList → Footer
 */
export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const { addRecent } = useToolsStore();

  const handleSelectTool = async (tool: Tool) => {
    if (!tool.isAvailable) return;
    addRecent(tool.id);
    await openToolWindow(tool);
  };

  return (
    <>
      {/* Search */}
      <SearchBar />

      {/* Category tabs */}
      <CategoryTabs active={activeTab} onChange={setActiveTab} />

      {/* Tools list — scrollable */}
      <ToolsList
        activeTab={activeTab}
        onSelectTool={handleSelectTool}
      />

      {/* Footer */}
      <PopupFooter />
    </>
  );
}
