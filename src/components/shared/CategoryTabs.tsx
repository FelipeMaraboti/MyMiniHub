import {
  Files, ImageIcon, AlignLeft, Braces,
  Timer, Cpu, LayoutGrid,
} from "lucide-react";
import { cn } from "@/utils";
import type { ToolCategory } from "@/types";

export type TabId = "all" | ToolCategory;

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "all",          label: "Todos",       icon: <LayoutGrid size={13} /> },
  { id: "files",        label: "Arquivos",    icon: <Files size={13} /> },
  { id: "images",       label: "Imagens",     icon: <ImageIcon size={13} /> },
  { id: "text",         label: "Texto",       icon: <AlignLeft size={13} /> },
  { id: "devtools",     label: "Dev",         icon: <Braces size={13} /> },
  { id: "productivity", label: "Foco",        icon: <Timer size={13} /> },
  { id: "system",       label: "Sistema",     icon: <Cpu size={13} /> },
];

interface CategoryTabsProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-0.5 px-2 py-2 overflow-x-auto no-drag border-b border-[rgba(255,255,255,0.06)]"
      style={{ scrollbarWidth: "none" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all duration-100 whitespace-nowrap shrink-0",
            active === tab.id
              ? "bg-accent/15 text-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
