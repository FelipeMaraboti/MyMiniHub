import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, Scissors } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";
import { PDFDocument } from "pdf-lib";

export function SplitPdfTool() {
  const [file, setFile] = useState<{path: string, name: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });
      if (selected && typeof selected === "string") {
        const name = selected.split(/[/\\]/).pop() || selected;
        setFile({ path: selected, name });
      }
    } catch (e) {
      console.error("Falha ao selecionar arquivo", e);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    
    try {
      // 1. Escolher pasta de destino
      const outputDir = await open({
        directory: true,
        multiple: false,
      });

      if (!outputDir || typeof outputDir !== "string") return;

      setIsProcessing(true);

      // 2. Carregar o PDF original
      const fileData = await readFile(file.path);
      const originalPdf = await PDFDocument.load(fileData);
      const pageCount = originalPdf.getPageCount();
      const baseName = file.name.replace(".pdf", "");

      // 3. Dividir páginas
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        
        // Determinar separador de diretório com base no outputDir (pode ser \ no windows)
        const separator = outputDir.includes("\\") ? "\\" : "/";
        const newPath = `${outputDir}${separator}${baseName}_pag_${i + 1}.pdf`;
        
        await writeFile(newPath, pdfBytes);
      }

      alert(`PDF dividido em ${pageCount} arquivos com sucesso! Salvos na pasta selecionada.`);
      setFile(null);
    } catch (error) {
      console.error("Erro ao dividir PDF", error);
      alert("Ocorreu um erro ao dividir o arquivo PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Arquivo PDF">
           <button 
               onClick={selectFile}
               className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-accent/50 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-accent/5 transition-colors cursor-pointer group w-full"
           >
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-accent mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   {file ? file.name : "Procurar arquivo PDF no computador"}
               </span>
           </button>
       </ToolSection>

       {file && (
           <div className="flex-1 flex flex-col items-center justify-center text-center text-[13px] text-muted-foreground p-4 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.05)]">
               <p>Dividir o arquivo</p>
               <p className="font-semibold text-foreground mt-1 mb-3 break-all">{file.name}</p>
               <p className="text-[11px] opacity-80 max-w-[250px]">
                   Ao clicar em Dividir, você será solicitado a escolher uma pasta onde as páginas individuais serão salvas.
               </p>
           </div>
       )}

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {file ? "Pronto para dividir" : "Selecione um arquivo"}
           </span>
           <ToolButton 
               variant="primary" 
               disabled={!file || isProcessing} 
               size="md"
               onClick={handleSplit}
           >
               <Scissors size={16} /> {isProcessing ? "Processando..." : "Dividir PDF"}
           </ToolButton>
       </div>
    </div>
  );
}
