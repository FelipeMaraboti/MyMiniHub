import { useState } from "react";
import { ToolSection, ToolButton } from "@/components/ui/ToolComponents";
import { UploadCloud, FilePlus2, Trash2 } from "lucide-react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";
import { PDFDocument } from "pdf-lib";

interface PdfItem {
  path: string;
  name: string;
}

export function MergePdfTool() {
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectFiles = async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });
      if (selected && Array.isArray(selected)) {
        const newFiles = selected.map((filePath) => {
          const name = filePath.split(/[/\\]/).pop() || filePath;
          return { path: filePath, name };
        });
        setFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (e) {
      console.error("Falha ao selecionar arquivos", e);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      // 1. Criar novo documento PDF
      const mergedPdf = await PDFDocument.create();

      // 2. Carregar cada PDF selecionado e copiar suas páginas
      for (const file of files) {
        const fileData = await readFile(file.path);
        const pdf = await PDFDocument.load(fileData);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // 3. Salvar PDF gerado
      const mergedPdfBytes = await mergedPdf.save();
      const savePath = await save({
        filters: [{ name: "PDF", extensions: ["pdf"] }],
        defaultPath: "Documento_Mesclado.pdf",
      });

      if (savePath) {
        await writeFile(savePath, mergedPdfBytes);
        alert("PDFs mesclados e salvos com sucesso!");
        setFiles([]);
      }
    } catch (error: any) {
      console.error("Erro ao mesclar PDFs", error);
      alert(`Ocorreu um erro ao processar os arquivos PDF: ${error?.message || String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
       <ToolSection title="Arquivos PDF">
           <button 
               onClick={selectFiles}
               className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-accent/50 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-accent/5 transition-colors cursor-pointer group w-full"
           >
               <UploadCloud size={28} className="text-muted-foreground group-hover:text-accent mb-2" />
               <span className="text-[13px] text-muted-foreground group-hover:text-foreground">
                   Procurar arquivos PDF no computador
               </span>
           </button>
       </ToolSection>

       {files.length > 0 && (
           <div className="flex-1 overflow-y-auto flex flex-col gap-2 max-h-[220px] border border-[rgba(255,255,255,0.06)] rounded-lg p-2 bg-[rgba(255,255,255,0.01)]">
               {files.map((file, i) => (
                   <div key={i + file.path} className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] group">
                       <span className="text-[12px] font-medium text-foreground truncate max-w-[200px]">
                           <span className="text-[10px] text-muted-foreground mr-2 font-mono">{i + 1}.</span> 
                           {file.name}
                       </span>
                       <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10 shrink-0 opacity-50 group-hover:opacity-100">
                           <Trash2 size={14} />
                       </button>
                   </div>
               ))}
           </div>
       )}

       <div className="mt-auto pt-4 flex justify-between items-center border-t border-[rgba(255,255,255,0.06)]">
           <span className="text-[11px] text-muted-foreground">
               {files.length} arquivo(s)
           </span>
           <ToolButton 
               variant="primary" 
               disabled={files.length < 2 || isProcessing} 
               size="md"
               onClick={handleMerge}
           >
               <FilePlus2 size={16} /> {isProcessing ? "Processando..." : "Juntar PDFs"}
           </ToolButton>
       </div>
    </div>
  );
}
