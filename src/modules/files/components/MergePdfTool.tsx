import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, FilePlus2, Trash2 } from "lucide-react";

/**
 * MergePdfTool — UI para juntar PDFs.
 */
export function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Arquivos PDF">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-accent/50 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-accent/5 transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-accent mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   Clique para selecionar ou arraste os arquivos
               </span>
               <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       {files.length > 0 && (
           <div className="flex-1 overflow-y-auto flex flex-col gap-2">
               {files.map((file, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                       <div className="flex flex-col">
                           <span className="text-[12px] font-medium text-foreground">{file.name}</span>
                           <span className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                       </div>
                       <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10">
                           <Trash2 size={14} />
                       </button>
                   </div>
               ))}
           </div>
       )}

       <div className="mt-auto pt-4 flex justify-end">
           <ToolButton variant="primary" disabled={files.length < 2} size="md">
               <FilePlus2 size={16} /> Juntar PDFs
           </ToolButton>
       </div>
    </div>
  );
}
