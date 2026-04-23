import { useState, useEffect } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { Power, Trash2, Keyboard, ShieldAlert, Palette, Monitor, Move, Maximize } from "lucide-react";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function SettingsTool() {
  const [autoStart, setAutoStart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Novas configurações
  const [theme, setTheme] = useState("dark");
  const [hideOnBlur, setHideOnBlur] = useState(true);
  const [resizable, setResizable] = useState(false);
  const [position, setPosition] = useState("center");

  useEffect(() => {
    // Carregar configurações locais
    setTheme(localStorage.getItem("myminihub_theme") || "dark");
    setHideOnBlur(localStorage.getItem("myminihub_hide_on_blur") !== "false");
    setResizable(localStorage.getItem("myminihub_resizable") === "true");
    setPosition(localStorage.getItem("myminihub_position") || "center");

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

  // Sync to Rust & LocalStorage
  useEffect(() => {
    if (isLoading) return; // evitar sobrescrever no primeiro render
    
    localStorage.setItem("myminihub_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("myminihub_hide_on_blur", String(hideOnBlur));
    localStorage.setItem("myminihub_position", position);
    localStorage.setItem("myminihub_resizable", String(resizable));

    try {
      invoke("update_config", { position, hideOnBlur }).catch(console.error);
      getCurrentWindow().setResizable(resizable).catch(console.error);
    } catch (e) {
      console.warn("Tauri APIs indisponíveis (provavelmente rodando no navegador).");
    }

  }, [theme, hideOnBlur, resizable, position, isLoading]);

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
    <div className="flex flex-col h-full p-4 gap-6 overflow-y-auto">
       
       <ToolSection title="Aparência">
           <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
               <div className="flex items-center gap-3">
                   <div className="p-2 rounded-md bg-white/5 text-muted-foreground">
                       <Palette size={16} />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[13px] font-medium text-foreground">Tema Visual</span>
                       <span className="text-[11px] text-muted-foreground">Escolha as cores do aplicativo</span>
                   </div>
               </div>
               <select
                 value={theme}
                 onChange={(e) => setTheme(e.target.value)}
                 className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-foreground text-[12px] rounded-md px-3 py-1.5 outline-none focus:border-[hsl(38,92%,55%)]"
               >
                 <option value="dark">Escuro (Padrão)</option>
                 <option value="light">Claro</option>
                 <option value="acrylic">Acrílico (Vidro)</option>
               </select>
           </div>
       </ToolSection>

       <ToolSection title="Janela e Comportamento">
           <div className="flex flex-col gap-3">
               {/* Fechar ao perder foco */}
               <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                   <div className="flex items-center gap-3">
                       <div className="p-2 rounded-md bg-white/5 text-muted-foreground">
                           <Monitor size={16} />
                       </div>
                       <div className="flex flex-col">
                           <span className="text-[13px] font-medium text-foreground">Fechar ao Perder o Foco</span>
                           <span className="text-[11px] text-muted-foreground">Ocultar janela ao clicar fora dela</span>
                       </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={hideOnBlur} onChange={() => setHideOnBlur(!hideOnBlur)} />
                     <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[hsl(262,80%,65%)]"></div>
                   </label>
               </div>

               {/* Redimensionável */}
               <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                   <div className="flex items-center gap-3">
                       <div className="p-2 rounded-md bg-white/5 text-muted-foreground">
                           <Maximize size={16} />
                       </div>
                       <div className="flex flex-col">
                           <span className="text-[13px] font-medium text-foreground">Janela Redimensionável</span>
                           <span className="text-[11px] text-muted-foreground">Permitir alterar o tamanho do app pelas bordas</span>
                       </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={resizable} onChange={() => setResizable(!resizable)} />
                     <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[hsl(262,80%,65%)]"></div>
                   </label>
               </div>

               {/* Posição Inicial */}
               <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                   <div className="flex items-center gap-3">
                       <div className="p-2 rounded-md bg-white/5 text-muted-foreground">
                           <Move size={16} />
                       </div>
                       <div className="flex flex-col">
                           <span className="text-[13px] font-medium text-foreground">Posição de Abertura</span>
                           <span className="text-[11px] text-muted-foreground">Onde a janela aparece na tela</span>
                       </div>
                   </div>
                   <select
                     value={position}
                     onChange={(e) => setPosition(e.target.value)}
                     className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-foreground text-[12px] rounded-md px-3 py-1.5 outline-none focus:border-[hsl(38,92%,55%)]"
                   >
                     <option value="center">Centro da Tela</option>
                     <option value="topRight">Canto Superior Direito</option>
                     <option value="topLeft">Canto Superior Esquerdo</option>
                     <option value="bottomRight">Canto Inferior Direito</option>
                   </select>
               </div>
           </div>
       </ToolSection>

       <ToolSection title="Sistema">
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
