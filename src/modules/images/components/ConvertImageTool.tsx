import { useState } from "react";
import { ToolSection, ToolButton, ToolSelect } from "@/components/ui/ToolComponents";
import { UploadCloud, ImageIcon } from "lucide-react";

export function ConvertImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/webp");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Imagem original">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[hsl(262,80%,65%,0.5)] rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[hsl(262,80%,65%,0.05)] transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-[hsl(262,80%,65%)] mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   {file ? file.name : "Selecionar imagem"}
               </span>
               <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       <ToolSection title="Formato de Saída">
           <ToolSelect value={format} onChange={(e) => setFormat(e.target.value)}>
               <option value="image/webp">WebP (Recomendado)</option>
               <option value="image/png">PNG</option>
               <option value="image/jpeg">JPEG</option>
           </ToolSelect>
       </ToolSection>

       <div className="mt-auto pt-4 flex justify-end">
           <ToolButton variant="primary" disabled={!file} size="md" className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white">
               <ImageIcon size={16} /> Converter e Salvar
           </ToolButton>
       </div>
    </div>
  );
}
