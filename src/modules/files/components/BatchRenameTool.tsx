import { useState } from "react";
import { ToolSection, ToolButton, ToolInput } from "@/components/ui/ToolComponents";
import { UploadCloud, FilePen, Trash2 } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { rename } from "@tauri-apps/plugin-fs";

interface FileItem {
  path: string;
  name: string;
  ext: string;
}

export function BatchRenameTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [prefix, setPrefix] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const selectFiles = async () => {
    try {
      const selected = await open({
        multiple: true,
        directory: false,
      });
      if (selected && Array.isArray(selected)) {
        const newFiles = selected.map((filePath) => {
          // Extrair o nome do arquivo e a extensão
          const nameWithExt = filePath.split(/[/\\]/).pop() || "";
          const lastDot = nameWithExt.lastIndexOf(".");
          const ext = lastDot !== -1 ? nameWithExt.substring(lastDot) : "";
          const name = lastDot !== -1 ? nameWithExt.substring(0, lastDot) : nameWithExt;
          return { path: filePath, name, ext };
        });
        
        // Evitar duplicatas
        setFiles((prev) => {
          const prevPaths = new Set(prev.map((f) => f.path));
          const uniqueNew = newFiles.filter((f) => !prevPaths.has(f.path));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (e) {
      console.error("Falha ao selecionar arquivos", e);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleRename = async () => {
    if (!prefix || files.length === 0) return;
    setIsRenaming(true);

    try {
      const renamedList: FileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Determinar o diretório (remover o nome antigo do final)
        const dirPath = file.path.substring(0, file.path.lastIndexOf(file.name + file.ext));
        
        // Novo nome com prefixo e índice (01, 02...)
        const newName = `${prefix}${(i + 1).toString().padStart(2, "0")}${file.ext}`;
        const newPath = `${dirPath}${newName}`;
        
        await rename(file.path, newPath);
        renamedList.push({ path: newPath, name: newName.replace(file.ext, ""), ext: file.ext });
      }
      setFiles(renamedList);
      alert("Arquivos renomeados com sucesso!");
    } catch (error) {
      console.error("Erro ao renomear arquivos", error);
      alert("Ocorreu um erro ao renomear os arquivos. Certifique-se de que eles não estão abertos em outro programa.");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Arquivos Originais">
           <button 
               onClick={selectFiles}
               className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-accent/50 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-accent/5 transition-colors cursor-pointer group w-full"
           >
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-accent mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   Procurar arquivos no computador
               </span>
           </button>
       </ToolSection>

       {files.length > 0 && (
           <div className="flex-1 overflow-y-auto flex flex-col gap-2 max-h-[160px] border border-[rgba(255,255,255,0.06)] rounded-lg p-2 bg-[rgba(255,255,255,0.01)]">
               {files.map((file, i) => (
                   <div key={file.path} className="flex items-center justify-between p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                       <div className="flex flex-col truncate flex-1 pr-4">
                           <span className="text-[12px] font-medium text-foreground truncate">{file.name}{file.ext}</span>
                           <span className="text-[10px] text-muted-foreground truncate opacity-60">
                              Novo nome será: <span className="text-accent">{prefix ? `${prefix}${(i + 1).toString().padStart(2, "0")}${file.ext}` : "---"}</span>
                           </span>
                       </div>
                       <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10 shrink-0">
                           <Trash2 size={14} />
                       </button>
                   </div>
               ))}
           </div>
       )}

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

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {files.length} arquivo(s) selecionado(s)
           </span>
           <ToolButton 
               variant="primary" 
               disabled={files.length === 0 || !prefix || isRenaming} 
               size="md"
               onClick={handleRename}
           >
               <FilePen size={16} /> {isRenaming ? "Renomeando..." : "Renomear Arquivos"}
           </ToolButton>
       </div>
    </div>
  );
}
