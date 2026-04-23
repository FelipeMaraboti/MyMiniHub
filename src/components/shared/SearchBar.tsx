import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useSearchStore } from "@/app/store";

/**
 * SearchBar — Input principal do popup.
 * Sempre recebe foco quando a janela abre.
 */
export function SearchBar() {
  const { query, setQuery } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca automaticamente ao montar
  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="drag-region flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(255,255,255,0.06)]">
      <Search size={16} className="text-muted-foreground shrink-0" strokeWidth={2} />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar ferramenta..."
        className="no-drag flex-1 bg-transparent text-[13.5px] text-foreground placeholder:text-muted-foreground/60 outline-none border-none"
        spellCheck={false}
        autoComplete="off"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="no-drag text-muted-foreground/50 hover:text-muted-foreground transition-colors text-xs shrink-0"
        >
          esc
        </button>
      )}
      <span className="no-drag shortcut-badge shrink-0">⌃⇧Space</span>
    </div>
  );
}
