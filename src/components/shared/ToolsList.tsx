import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { ToolListItem } from "./ToolListItem";
import { SectionLabel } from "./SectionLabel";
import { useSearchStore, useToolsStore } from "@/app/store";
import { TOOL_REGISTRY, getToolById } from "@/utils/tool-registry";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import type { Tool } from "@/types";
import type { TabId } from "./CategoryTabs";

interface ToolsListProps {
  activeTab: TabId;
  onSelectTool: (tool: Tool) => void;
}

export function ToolsList({ activeTab, onSelectTool }: ToolsListProps) {
  const { query } = useSearchStore();
  const { favorites, recents } = useToolsStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Filtra ferramentas por tab e query
  const filteredTools = TOOL_REGISTRY.filter((tool) => {
    const matchesTab = activeTab === "all" || tool.category === activeTab;
    if (!query) return matchesTab;
    const q = query.toLowerCase();
    return matchesTab && (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Ferramentas recentes (sem busca ativa, sem filtro de aba)
  const recentTools = recents
    .slice(0, 4)
    .map((r) => getToolById(r.toolId))
    .filter((t): t is Tool => !!t);

  // Favoritos
  const favTools = favorites
    .map((f) => getToolById(f.toolId))
    .filter((t): t is Tool => !!t);

  // Lista "flat" para navegação por teclado
  const flatList: Tool[] = query
    ? filteredTools
    : activeTab === "all"
      ? filteredTools
      : filteredTools;

  // Reset index on query/tab change
  useEffect(() => setActiveIndex(0), [query, activeTab]);

  useKeyboardNav({
    count: flatList.length,
    activeIndex,
    setActiveIndex,
    onSelect: (i) => onSelectTool(flatList[i]),
    onEscape: () => window.dispatchEvent(new CustomEvent("hide-popup")),
  });

  // Auto-scroll para item ativo
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Estado vazio
  if (flatList.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
        <Search size={22} className="text-muted-foreground/30" />
        <p className="text-[12px] text-muted-foreground/50">
          Nenhuma ferramenta encontrada
        </p>
        {query && (
          <p className="text-[11px] text-muted-foreground/30">
            Tente outro termo
          </p>
        )}
      </div>
    );
  }

  // Modo busca ativa — lista plana
  if (query) {
    return (
      <div ref={listRef} className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 animate-fade-in">
        <SectionLabel label={`${flatList.length} resultado${flatList.length > 1 ? "s" : ""}`} />
        {flatList.map((tool, i) => (
          <ToolListItem
            key={tool.id}
            tool={tool}
            isActive={i === activeIndex}
            onSelect={onSelectTool}
            index={i}
          />
        ))}
      </div>
    );
  }

  // Modo normal (sem busca) — seções
  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-2 py-2 animate-fade-in">

      {/* Favoritos */}
      {activeTab === "all" && favTools.length > 0 && (
        <div className="mb-1">
          <SectionLabel label="Favoritos" />
          <div className="space-y-0.5">
            {favTools.map((tool, i) => (
              <ToolListItem
                key={tool.id}
                tool={tool}
                isActive={i === activeIndex}
                onSelect={onSelectTool}
                index={i}
              />
            ))}
          </div>
          <hr className="popup-divider my-2" />
        </div>
      )}

      {/* Recentes */}
      {activeTab === "all" && recentTools.length > 0 && (
        <div className="mb-1">
          <SectionLabel label="Recentes" />
          <div className="space-y-0.5">
            {recentTools.map((tool, i) => (
              <ToolListItem
                key={tool.id}
                tool={tool}
                isActive={(favTools.length > 0 ? favTools.length : 0) + i === activeIndex}
                onSelect={onSelectTool}
                index={(favTools.length > 0 ? favTools.length : 0) + i}
              />
            ))}
          </div>
          <hr className="popup-divider my-2" />
        </div>
      )}

      {/* Todas / por categoria */}
      <div>
        <SectionLabel label={activeTab === "all" ? "Todas as ferramentas" : "Ferramentas"} />
        <div className="space-y-0.5">
          {filteredTools.map((tool, i) => (
            <ToolListItem
              key={tool.id}
              tool={tool}
              isActive={i === activeIndex}
              onSelect={onSelectTool}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
