import { useState, useEffect } from "react";
import { ToolTextarea } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { Plus, Trash2 } from "lucide-react";

interface Note {
  id: string;
  text: string;
  updatedAt: number;
}

/**
 * QuickNotesTool — Notas rápidas locais.
 */
export function QuickNotesTool() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("myminihub_quicknotes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
      } catch (e) {
        console.error("Failed to load notes", e);
      }
    } else {
      handleNewNote();
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("myminihub_quicknotes", JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text: "",
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (text: string) => {
    if (!activeNoteId) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId ? { ...n, text, updatedAt: Date.now() } : n
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    const nextNotes = notes.filter((n) => n.id !== id);
    setNotes(nextNotes);
    if (nextNotes.length === 0) {
      handleNewNote();
    } else if (activeNoteId === id) {
      setActiveNoteId(nextNotes[0].id);
    }
  };

  return (
    <div className="flex h-full border-t border-[rgba(255,255,255,0.06)]">
      {/* Sidebar de notas */}
      <div className="w-1/3 border-r border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.1)] flex flex-col">
        <div className="p-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <span className="text-[12px] font-medium text-foreground">Notas</span>
          <button
            onClick={handleNewNote}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`group flex flex-col p-2.5 rounded-lg cursor-pointer transition-colors ${
                activeNoteId === note.id
                  ? "bg-accent/20 border border-accent/30"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-medium text-foreground truncate">
                  {note.text.split("\n")[0] || "Nova nota"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 truncate">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Principal */}
      <div className="flex-1 flex flex-col p-4">
        {activeNote ? (
          <div className="relative flex-1 flex flex-col">
             <ToolTextarea
              value={activeNote.text}
              onChange={(e) => handleUpdateNote(e.target.value)}
              placeholder="Escreva sua nota aqui..."
              className="flex-1 border-none bg-transparent focus:bg-transparent resize-none h-full"
            />
            {activeNote.text && (
              <div className="absolute bottom-2 right-2">
                <CopyButton value={activeNote.text} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-[13px]">
            Selecione uma nota
          </div>
        )}
      </div>
    </div>
  );
}
