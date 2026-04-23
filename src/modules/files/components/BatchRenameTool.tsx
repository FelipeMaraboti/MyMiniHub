import { useState } from "react";
import { ToolSection, ToolButton, ToolInput } from "@/components/ui/ToolComponents";
import { UploadCloud, FilePen } from "lucide-react";

/**
 * BatchRenameTool — UI para renomear em lote.
 */
export function BatchRenameTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [prefix, setPrefix] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Arquivos">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-accent/50 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-accent/5 transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-accent mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   Selecionar múltiplos arquivos
               </span>
               <input type="file" multiple className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       <ToolSection title="Padrão de Renomeação">
           <div className="flex items-center gap-3">
               <ToolInput
                   value={prefix}
                   onChange={(e) => setPrefix(e.target.value)}
                   placeholder="Prefixo (ex: Foto_Férias_)"
               />
               <span className="text-[12px] text-muted-foreground whitespace-nowrap">
                   + 01, 02, 03...
               </span>
           </div>
       </ToolSection>

       <div className="mt-auto pt-4 flex justify-between items-center">
           <span className="text-[11px] text-muted-foreground">
               {files.length} arquivo(s) selecionado(s)
           </span>
           <ToolButton variant="primary" disabled={files.length === 0} size="md">
               <FilePen size={16} /> Renomear Arquivos
           </ToolButton>
       </div>
    </div>
  );
}
