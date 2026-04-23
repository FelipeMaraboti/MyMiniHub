import { useState, useEffect } from "react";
import { ToolButton } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { Trash2, ClipboardPaste } from "lucide-react";

interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
}

/**
 * ClipboardHistoryTool — Historico do Clipboard local.
 * Faz polling do clipboard atual e salva no historico.
 */
export function ClipboardHistoryTool() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [isPolling, setIsPolling] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("myminihub_clipboard");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load clipboard history", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("myminihub_clipboard", JSON.stringify(history));
  }, [history]);

  // Poll clipboard
  useEffect(() => {
    if (!isPolling) return;

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          setHistory((prev) => {
            // Se o texto mais recente ja for este, ignora
            if (prev.length > 0 && prev[0].text === text) return prev;
            // Se ja existir no historico, remove o antigo
            const filtered = prev.filter((item) => item.text !== text);
            return [{ id: crypto.randomUUID(), text, timestamp: Date.now() }, ...filtered].slice(0, 50); // Mantem os ultimos 50
          });
        }
      } catch (e) {
        // Ignora erros de leitura (ex: falta de permissao ou fora de foco)
      }
    };

    const interval = setInterval(checkClipboard, 2000);
    return () => clearInterval(interval);
  }, [isPolling]);

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
         <span className="text-[13px] font-semibold text-foreground">
             Histórico Recente
         </span>
         <div className="flex items-center gap-3">
             <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                 <input
                     type="checkbox"
                     checked={isPolling}
                     onChange={(e) => setIsPolling(e.target.checked)}
                     className="accent-accent"
                 />
                 Capturar automaticamente
             </label>
             {history.length > 0 && (
                 <ToolButton variant="ghost" onClick={clearHistory} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                     Limpar Histórico
                 </ToolButton>
             )}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
         {history.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-muted-foreground text-[12px] mt-10 h-32 gap-3">
                 <ClipboardPaste size={32} className="opacity-20" />
                 O histórico está vazio. Copie algo para aparecer aqui.
             </div>
         ) : history.map((item) => (
             <div key={item.id} className="group flex flex-col gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-colors">
                 <div className="flex justify-between items-start gap-2">
                     <p className="text-[12px] text-foreground font-mono whitespace-pre-wrap break-all line-clamp-4 leading-relaxed">
                         {item.text}
                     </p>
                 </div>
                 <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2 mt-1">
                     <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                         {new Date(item.timestamp).toLocaleTimeString()}
                     </span>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <CopyButton value={item.text} />
                         <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                             <Trash2 size={13} />
                         </button>
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
