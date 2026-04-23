import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, FileDown } from "lucide-react";

export function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Imagens (PNG, JPG, WebP)">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[hsl(262,80%,65%,0.5)] rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[hsl(262,80%,65%,0.05)] transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-[hsl(262,80%,65%)] mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   Selecionar imagens para converter
               </span>
               <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       {files.length > 0 && (
           <div className="flex-1 overflow-y-auto flex gap-2 flex-wrap">
               {files.map((file, i) => (
                   <div key={i} className="w-16 h-16 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
                       <img src={URL.createObjectURL(file)} alt="" className="object-cover w-full h-full opacity-80" />
                   </div>
               ))}
           </div>
       )}

       <div className="mt-auto pt-4 flex justify-between items-center">
           <span className="text-[11px] text-muted-foreground">
               {files.length} imagem(ns)
           </span>
           <ToolButton variant="primary" disabled={files.length === 0} size="md" className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white">
               <FileDown size={16} /> Gerar PDF
           </ToolButton>
       </div>
    </div>
  );
}
