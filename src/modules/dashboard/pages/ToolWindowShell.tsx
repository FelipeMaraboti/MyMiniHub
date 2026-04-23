import { useParams } from "react-router-dom";
import { getToolById } from "@/utils/tool-registry";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ToolContentRouter } from "@/modules/dashboard/components/ToolContentRouter";

// Mapa de cores por categoria
const CATEGORY_ICON_BG: Record<string, string> = {
  files:        "bg-[hsl(199,89%,55%,0.12)] text-[hsl(199,89%,55%)]",
  images:       "bg-[hsl(262,80%,65%,0.12)] text-[hsl(262,80%,65%)]",
  text:         "bg-[hsl(142,71%,45%,0.12)] text-[hsl(142,71%,45%)]",
  devtools:     "bg-[hsl(38,92%,55%,0.12)]  text-[hsl(38,92%,55%)]",
  productivity: "bg-[hsl(326,80%,62%,0.12)] text-[hsl(326,80%,62%)]",
  system:       "bg-[hsl(215,20%,60%,0.12)] text-[hsl(215,20%,60%)]",
};

/**
 * ToolWindowShell — Shell para janelas de ferramentas secundárias.
 * Header fixo com ícone, nome e botão fechar.
 * Conteúdo delegado ao ToolContentRouter por tool.id.
 */
export function ToolWindowShell() {
  const { id } = useParams<{ id: string }>();
  const tool = id ? getToolById(id) : null;

  if (!tool) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-muted-foreground text-[13px]">
        Ferramenta não encontrada.
      </div>
    );
  }

  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number; strokeWidth?: number }>>)[tool.icon];
  const iconBg = CATEGORY_ICON_BG[tool.category] ?? "bg-white/8 text-foreground";

  return (
    <div className="flex flex-col h-screen bg-[hsl(228,15%,8%)] text-foreground">
      {/* ── Header ── */}
      <header className="drag-region flex items-center gap-3 px-5 py-3.5 border-b border-[rgba(255,255,255,0.07)] shrink-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          {IconComponent && <IconComponent size={15} strokeWidth={2} />}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-[13.5px] font-semibold text-foreground leading-none">
            {tool.name}
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate leading-none">
            {tool.description}
          </p>
        </div>

        <button
          onClick={() => window.close()}
          className="no-drag w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          title="Fechar"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </header>

      {/* ── Conteúdo da ferramenta ── */}
      <main className="flex-1 overflow-hidden">
        <ToolContentRouter toolId={id!} />
      </main>
    </div>
  );
}
