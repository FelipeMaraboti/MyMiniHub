import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, Scissors } from "lucide-react";

/**
 * SplitPdfTool — UI para dividir PDF.
 */
export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Arquivo PDF">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-accent/50 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-accent/5 transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-accent mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   {file ? file.name : "Clique para selecionar o arquivo PDF"}
               </span>
               <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       {file && (
           <div className="flex-1 flex flex-col items-center justify-center text-center text-[13px] text-muted-foreground">
               <p>Dividir o arquivo <strong>{file.name}</strong></p>
               <p className="mt-2 text-[11px] opacity-70">(Implementação da separação de páginas requer integração Tauri/Rust ou PDF-lib na fase final)</p>
           </div>
       )}

       <div className="mt-auto pt-4 flex justify-end">
           <ToolButton variant="primary" disabled={!file} size="md">
               <Scissors size={16} /> Dividir PDF
           </ToolButton>
       </div>
    </div>
  );
}
