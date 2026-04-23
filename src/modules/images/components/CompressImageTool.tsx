import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, PackageOpen } from "lucide-react";

export function CompressImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Imagem para comprimir">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[hsl(262,80%,65%,0.5)] rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[hsl(262,80%,65%,0.05)] transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-[hsl(262,80%,65%)] mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   {file ? file.name : "Selecionar imagem"}
               </span>
               <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       <ToolSection title={`Qualidade: ${quality}%`}>
          <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[hsl(262,80%,65%)] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Mais compressão</span>
              <span>Melhor qualidade</span>
          </div>
       </ToolSection>

       <div className="mt-auto pt-4 flex justify-end">
           <ToolButton variant="primary" disabled={!file} size="md" className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white">
               <PackageOpen size={16} /> Comprimir Imagem
           </ToolButton>
       </div>
    </div>
  );
}
