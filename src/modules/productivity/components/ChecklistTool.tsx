import { useState, useEffect } from "react";
import { ToolInput, ToolButton } from "@/components/ui/ToolComponents";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/utils";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * ChecklistTool — Checklist diaria local.
 */
export function ChecklistTool() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("myminihub_checklist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("myminihub_checklist", JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setItems([
      ...items,
      { id: crypto.randomUUID(), text: inputValue.trim(), completed: false },
    ]);
    setInputValue("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.completed));
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-foreground">Tarefas do Dia</span>
                <span className="text-[11px] text-muted-foreground">{completedCount} de {items.length} concluidas</span>
            </div>
            <div className="flex items-center gap-2">
                 <div className="w-24 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                 </div>
                 <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">{progress}%</span>
            </div>
       </div>

      <form onSubmit={handleAddItem} className="flex gap-2">
        <ToolInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="flex-1"
        />
        <ToolButton type="submit" variant="primary" disabled={!inputValue.trim()}>
          <Plus size={16} />
        </ToolButton>
      </form>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 mt-2">
         {items.length === 0 ? (
             <div className="text-center text-muted-foreground text-[12px] mt-10">Nenhuma tarefa adicionada.</div>
         ) : items.map((item) => (
             <div key={item.id} className="group flex items-center justify-between px-3 py-2.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-colors">
                 <button onClick={() => toggleItem(item.id)} className="flex items-center gap-3 flex-1 text-left">
                     {item.completed ? (
                         <CheckCircle2 size={16} className="text-accent shrink-0" />
                     ) : (
                         <Circle size={16} className="text-muted-foreground shrink-0" />
                     )}
                     <span className={cn("text-[13px] transition-colors truncate", item.completed ? "text-muted-foreground line-through" : "text-foreground")}>
                         {item.text}
                     </span>
                 </button>
                 <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all">
                     <Trash2 size={14} />
                 </button>
             </div>
         ))}
      </div>

      {completedCount > 0 && (
         <div className="flex justify-center pt-2 border-t border-[rgba(255,255,255,0.06)]">
            <ToolButton variant="ghost" onClick={clearCompleted} className="text-[11px] text-muted-foreground">
                Limpar concluídas
            </ToolButton>
         </div>
      )}
    </div>
  );
}
