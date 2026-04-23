import { useState } from "react";
import { ToolSection, ToolButton, ToolInput } from "@/components/ui/ToolComponents";
import { UploadCloud, Maximize2 } from "lucide-react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

export function ResizeImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      
      // Obter dimensões originais para preencher os inputs
      const imgUrl = URL.createObjectURL(selected);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        URL.revokeObjectURL(imgUrl);
      };
      img.src = imgUrl;
    }
  };

  const handleResize = async () => {
    if (!file || !width || !height) return;
    setIsProcessing(true);

    try {
      const targetWidth = parseInt(width, 10);
      const targetHeight = parseInt(height, 10);

      if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
        alert("Dimensões inválidas.");
        setIsProcessing(false);
        return;
      }

      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context não suportado");
      
      // Manter qualidade de redimensionamento
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Usar WebP ou manter o formato original (aqui mantemos png se original for png)
      const outputFormat = file.type === "image/png" ? "image/png" : "image/jpeg";
      const ext = outputFormat === "image/png" ? "png" : "jpg";

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Falha ao gerar blob"));
        }, outputFormat, 0.92);
      });

      const savePath = await save({
        filters: [{ name: "Imagem", extensions: [ext] }],
        defaultPath: `Imagem_Redimensionada_${targetWidth}x${targetHeight}.${ext}`,
      });

      if (savePath) {
        const buffer = await blob.arrayBuffer();
        await writeFile(savePath, new Uint8Array(buffer));
        alert("Imagem redimensionada e salva com sucesso!");
      }
      
      URL.revokeObjectURL(imgUrl);
    } catch (error) {
      console.error("Erro ao redimensionar imagem", error);
      alert("Ocorreu um erro ao redimensionar a imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Imagem para redimensionar">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[hsl(262,80%,65%,0.5)] rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[hsl(262,80%,65%,0.05)] transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-[hsl(262,80%,65%)] mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   {file ? file.name : "Selecionar imagem"}
               </span>
               <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       <div className="grid grid-cols-2 gap-4">
           <ToolSection title="Largura (px)">
               <ToolInput
                   type="number"
                   value={width}
                   onChange={(e) => setWidth(e.target.value)}
                   placeholder="Auto"
               />
           </ToolSection>
           <ToolSection title="Altura (px)">
               <ToolInput
                   type="number"
                   value={height}
                   onChange={(e) => setHeight(e.target.value)}
                   placeholder="Auto"
               />
           </ToolSection>
       </div>

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {file && width && height ? `Nova dimensão: ${width}x${height}` : "Selecione uma imagem"}
           </span>
           <ToolButton 
               variant="primary" 
               disabled={!file || !width || !height || isProcessing} 
               size="md" 
               className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white"
               onClick={handleResize}
           >
               <Maximize2 size={16} /> {isProcessing ? "Processando..." : "Redimensionar"}
           </ToolButton>
       </div>
    </div>
  );
}
