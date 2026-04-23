import { useState, useEffect } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { Power, Trash2, Keyboard, ShieldAlert } from "lucide-react";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";

export function SettingsTool() {
  const [autoStart, setAutoStart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o autostart está ativo
    const checkAutostart = async () => {
      try {
        const enabled = await isEnabled();
        setAutoStart(enabled);
      } catch (e) {
        console.error("Erro ao verificar autostart", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAutostart();
  }, []);

  const toggleAutoStart = async () => {
    try {
      if (autoStart) {
        await disable();
        setAutoStart(false);
      } else {
        await enable();
        setAutoStart(true);
      }
    } catch (e) {
      console.error("Falha ao alterar autostart", e);
      alert("Falha ao configurar a inicialização automática. Seu sistema operacional pode estar bloqueando a ação.");
    }
  };

  const clearAllData = () => {
    const confirmClear = window.confirm(
      "Isso apagará seu Histórico do Clipboard, Notas Rápidas e Checklist. Essa ação não pode ser desfeita. Tem certeza?"
    );
    if (confirmClear) {
      localStorage.removeItem("myminihub_clipboard");
      localStorage.removeItem("myminihub_quicknotes");
      localStorage.removeItem("myminihub_checklist");
      alert("Todos os dados foram limpos com sucesso!");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-6">
       
       <ToolSection title="Geral">
           <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
               <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-md ${autoStart ? "bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,45%)]" : "bg-white/5 text-muted-foreground"}`}>
                       <Power size={16} />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[13px] font-medium text-foreground">Iniciar com o Windows</span>
                       <span className="text-[11px] text-muted-foreground">Abrir o myMiniHub automaticamente ao ligar o PC</span>
                   </div>
               </div>
               
               <label className="relative inline-flex items-center cursor-pointer">
                 <input 
                    type="checkbox" 
                    value="" 
                    className="sr-only peer" 
                    checked={autoStart} 
                    onChange={toggleAutoStart}
                    disabled={isLoading}
                 />
                 <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[hsl(262,80%,65%)]"></div>
               </label>
           </div>
       </ToolSection>

       <ToolSection title="Atalhos">
           <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
               <div className="flex items-center gap-3">
                   <div className="p-2 rounded-md bg-white/5 text-muted-foreground">
                       <Keyboard size={16} />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[13px] font-medium text-foreground">Atalho Global</span>
                       <span className="text-[11px] text-muted-foreground">Abrir/Fechar o aplicativo instantaneamente</span>
                   </div>
               </div>
               <div className="flex gap-1.5 font-mono text-[11px]">
                   <span className="px-2 py-1 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] text-foreground">Ctrl</span>
                   <span className="px-2 py-1 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] text-foreground">Shift</span>
                   <span className="px-2 py-1 rounded bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] text-foreground">Space</span>
               </div>
           </div>
       </ToolSection>

       <ToolSection title="Zona de Perigo">
           <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
               <div className="flex items-center gap-3">
                   <div className="p-2 rounded-md bg-destructive/20 text-destructive">
                       <ShieldAlert size={16} />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[13px] font-medium text-destructive">Limpar Dados Locais</span>
                       <span className="text-[11px] text-destructive/70">Apagar todo histórico, notas e configurações locais</span>
                   </div>
               </div>
               <ToolButton variant="ghost" onClick={clearAllData} className="text-destructive hover:text-white hover:bg-destructive">
                   <Trash2 size={14} className="mr-1.5" /> Limpar Tudo
               </ToolButton>
           </div>
       </ToolSection>
       
       <div className="mt-auto text-center">
           <span className="text-[10px] font-mono text-muted-foreground opacity-50">myMiniHub v1.0.0</span>
       </div>
    </div>
  );
}
