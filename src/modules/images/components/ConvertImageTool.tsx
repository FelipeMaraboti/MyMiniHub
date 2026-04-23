import { useState } from "react";
import { ToolSection, ToolButton, ToolSelect } from "@/components/ui/ToolComponents";
import { UploadCloud, ImageIcon } from "lucide-react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

export function ConvertImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/webp");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // 1. Carregar imagem
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgUrl;
      });

      // 2. Desenhar no Canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context não suportado");
      ctx.drawImage(img, 0, 0);

      // 3. Obter o blob no formato selecionado
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Falha ao gerar blob"));
        }, format, 0.92); // Qualidade alta padrão
      });

      // 4. Salvar com Tauri
      const ext = format.split("/")[1];
      const savePath = await save({
        filters: [{ name: "Imagem", extensions: [ext === "jpeg" ? "jpg" : ext] }],
        defaultPath: `Imagem_Convertida.${ext === "jpeg" ? "jpg" : ext}`,
      });

      if (savePath) {
        const buffer = await blob.arrayBuffer();
        await writeFile(savePath, new Uint8Array(buffer));
        alert("Imagem convertida e salva com sucesso!");
        setFile(null);
      }
      
      URL.revokeObjectURL(imgUrl);
    } catch (error) {
      console.error("Erro ao converter imagem", error);
      alert("Ocorreu um erro ao converter a imagem.");
    } finally {
      setIsProcessing(false);
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

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {file ? `Pronto para converter` : "Selecione uma imagem"}
           </span>
           <ToolButton 
               variant="primary" 
               disabled={!file || isProcessing} 
               size="md" 
               className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white"
               onClick={handleConvert}
           >
               <ImageIcon size={16} /> {isProcessing ? "Processando..." : "Converter e Salvar"}
           </ToolButton>
       </div>
    </div>
  );
}
