import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, PackageOpen } from "lucide-react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

export function CompressImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context não suportado");
      ctx.drawImage(img, 0, 0);

      // Usar WebP para compressão, pois tem melhor desempenho e suporta qualidade
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Falha ao gerar blob"));
        }, "image/webp", quality / 100);
      });

      const savePath = await save({
        filters: [{ name: "WebP Image", extensions: ["webp"] }],
        defaultPath: `Imagem_Comprimida_${quality}q.webp`,
      });

      if (savePath) {
        const buffer = await blob.arrayBuffer();
        await writeFile(savePath, new Uint8Array(buffer));
        
        const originalSize = (file.size / 1024).toFixed(1);
        const newSize = (blob.size / 1024).toFixed(1);
        const ratio = (100 - (blob.size / file.size) * 100).toFixed(1);

        alert(`Compressão concluída!\n\nTamanho original: ${originalSize} KB\nNovo tamanho: ${newSize} KB\nRedução de: ${ratio}%`);
        setFile(null);
      }
      
      URL.revokeObjectURL(imgUrl);
    } catch (error) {
      console.error("Erro ao comprimir imagem", error);
      alert("Ocorreu um erro ao comprimir a imagem.");
    } finally {
      setIsProcessing(false);
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

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {file ? `Original: ${(file.size / 1024).toFixed(1)} KB` : "Selecione uma imagem"}
           </span>
           <ToolButton 
               variant="primary" 
               disabled={!file || isProcessing} 
               size="md" 
               className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white"
               onClick={handleCompress}
           >
               <PackageOpen size={16} /> {isProcessing ? "Comprimindo..." : "Comprimir Imagem"}
           </ToolButton>
       </div>
    </div>
  );
}
