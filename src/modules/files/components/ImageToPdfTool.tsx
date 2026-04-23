import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, FileDown, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

export function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleGeneratePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let pdfImage;
        
        // Determinar o tipo da imagem
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // pdf-lib não suporta webp ou gif nativamente sem conversão prévia, então vamos pular ou falhar gracefully
          console.warn(`Formato ${file.type} não suportado diretamente pelo pdf-lib. A imagem ${file.name} foi ignorada.`);
          continue;
        }

        const dims = pdfImage.scale(1);
        const page = pdfDoc.addPage([dims.width, dims.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }

      if (pdfDoc.getPageCount() === 0) {
        alert("Nenhuma imagem compatível foi encontrada (Apenas JPG e PNG são suportados nativamente para geração de PDF direto).");
        return;
      }

      const pdfBytes = await pdfDoc.save();
      
      const savePath = await save({
        filters: [{ name: "PDF", extensions: ["pdf"] }],
        defaultPath: "Imagens_Convertidas.pdf",
      });

      if (savePath) {
        await writeFile(savePath, pdfBytes);
        alert("PDF gerado e salvo com sucesso!");
        setFiles([]);
      }
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
      alert("Ocorreu um erro ao gerar o PDF a partir das imagens.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Imagens (Apenas PNG e JPG)">
           <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[hsl(262,80%,65%,0.5)] rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[hsl(262,80%,65%,0.05)] transition-colors cursor-pointer group">
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-[hsl(262,80%,65%)] mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   Selecionar imagens (PNG/JPG)
               </span>
               <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
           </label>
       </ToolSection>

       {files.length > 0 && (
           <div className="flex-1 overflow-y-auto flex gap-3 flex-wrap p-2 border border-[rgba(255,255,255,0.06)] rounded-lg max-h-[220px] bg-[rgba(255,255,255,0.01)]">
               {files.map((file, i) => (
                   <div key={i + file.name} className="w-20 h-20 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden relative group shrink-0">
                       <img src={URL.createObjectURL(file)} alt="" className="object-cover w-full h-full opacity-80" />
                       <button onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 bg-black/60 rounded text-white opacity-0 group-hover:opacity-100 hover:text-destructive transition-all">
                          <Trash2 size={12} />
                       </button>
                   </div>
               ))}
           </div>
       )}

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {files.length} imagem(ns) selecionada(s)
           </span>
           <ToolButton 
               variant="primary" 
               disabled={files.length === 0 || isProcessing} 
               size="md" 
               className="bg-[hsl(262,80%,65%)] hover:bg-[hsl(262,80%,65%)] text-white"
               onClick={handleGeneratePdf}
           >
               <FileDown size={16} /> {isProcessing ? "Gerando..." : "Gerar PDF"}
           </ToolButton>
       </div>
    </div>
  );
}
