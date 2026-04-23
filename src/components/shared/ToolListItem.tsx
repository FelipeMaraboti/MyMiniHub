import * as LucideIcons from "lucide-react";
import { Star } from "lucide-react";
import { cn } from "@/utils";
import type { Tool } from "@/types";
import { useToolsStore } from "@/app/store";

// Mapa de cores por categoria
const CATEGORY_COLORS: Record<string, string> = {
  files:        "text-[hsl(199,89%,55%)]",
  images:       "text-[hsl(262,80%,65%)]",
  text:         "text-[hsl(142,71%,45%)]",
  devtools:     "text-[hsl(38,92%,55%)]",
  productivity: "text-[hsl(326,80%,62%)]",
  system:       "text-[hsl(215,20%,60%)]",
};

const CATEGORY_BG: Record<string, string> = {
  files:        "bg-[hsl(199,89%,55%,0.1)]",
  images:       "bg-[hsl(262,80%,65%,0.1)]",
  text:         "bg-[hsl(142,71%,45%,0.1)]",
  devtools:     "bg-[hsl(38,92%,55%,0.1)]",
  productivity: "bg-[hsl(326,80%,62%,0.1)]",
  system:       "bg-[hsl(215,20%,60%,0.1)]",
};

interface ToolListItemProps {
  tool: Tool;
  isActive?: boolean;
  onSelect: (tool: Tool) => void;
  index?: number;
}

export function ToolListItem({ tool, isActive = false, onSelect }: ToolListItemProps) {
  const { isFavorite, addFavorite, removeFavorite } = useToolsStore();
  const favorite = isFavorite(tool.id);

  // Pega o ícone do Lucide dinamicamente
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number; strokeWidth?: number }>>)[tool.icon];

  const colorClass = CATEGORY_COLORS[tool.category] ?? "text-muted-foreground";
  const bgClass = CATEGORY_BG[tool.category] ?? "bg-white/5";

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) removeFavorite(tool.id);
    else addFavorite(tool.id);
  };

  return (
    <button
      onClick={() => !tool.isAvailable || onSelect(tool)}
      className={cn(
        "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-100 text-left",
        isActive ? "bg-white/8" : "hover:bg-white/5",
        !tool.isAvailable && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Icon */}
      <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center", bgClass)}>
        {IconComponent && (
          <IconComponent size={15} strokeWidth={2} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-[13px] font-medium leading-none", colorClass)}>
            {tool.name}
          </span>
          {tool.badge && (
            <span className={cn(
              "text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
              tool.badge === "new" && "bg-accent/20 text-accent",
              tool.badge === "beta" && "bg-warning/20 text-warning",
              tool.badge === "soon" && "bg-muted text-muted-foreground",
            )}>
              {tool.badge === "soon" ? "em breve" : tool.badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5 truncate leading-none">
          {tool.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleFavorite}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-0.5",
            favorite && "opacity-100"
          )}
        >
          <Star
            size={13}
            strokeWidth={2}
            className={cn(
              "transition-colors",
              favorite ? "fill-warning text-warning" : "text-muted-foreground/40 hover:text-warning"
            )}
          />
        </button>
      </div>
    </button>
  );
}
