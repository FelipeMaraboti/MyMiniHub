import { useState, useEffect } from "react";
import { ToolSection, ToolButton, ToolInput } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

type DocType = "cpf" | "cnpj";

export function DocsBrTool() {
  const [docType, setDocType] = useState<DocType>("cpf");
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [useMask, setUseMask] = useState(true);
  
  // Validation State
  const [inputDoc, setInputDoc] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // --- Funções de Validação e Geração (Matemática) ---
  
  const generateRandomNumbers = (count: number) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 10));
  };

  const calculateDigit = (arr: number[], factorStart: number) => {
    let total = 0;
    let factor = factorStart;
    for (const num of arr) {
      total += num * factor;
      factor = factor === 2 ? 9 : factor - 1;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const generateCPF = () => {
    const nums = generateRandomNumbers(9);
    nums.push(calculateDigit(nums, 10));
    nums.push(calculateDigit(nums, 11));
    return nums.join("");
  };

  const generateCNPJ = () => {
    const nums = generateRandomNumbers(8).concat([0, 0, 0, 1]);
    nums.push(calculateDigit(nums, 5));
    nums.push(calculateDigit(nums, 6));
    return nums.join("");
  };

  const formatDoc = (doc: string, type: DocType) => {
    if (type === "cpf") {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    const nums = cpf.split("").map(Number);
    if (calculateDigit(nums.slice(0, 9), 10) !== nums[9]) return false;
    if (calculateDigit(nums.slice(0, 10), 11) !== nums[10]) return false;
    return true;
  };

  const validateCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
    const nums = cnpj.split("").map(Number);
    if (calculateDigit(nums.slice(0, 12), 5) !== nums[12]) return false;
    if (calculateDigit(nums.slice(0, 13), 6) !== nums[13]) return false;
    return true;
  };

  // --- Handlers ---

  const handleGenerate = () => {
    const doc = docType === "cpf" ? generateCPF() : generateCNPJ();
    setGeneratedDoc(useMask ? formatDoc(doc, docType) : doc);
  };

  useEffect(() => {
    handleGenerate();
  }, [docType, useMask]);

  useEffect(() => {
    if (!inputDoc) {
      setIsValid(null);
      return;
    }
    const cleanInput = inputDoc.replace(/[^\d]+/g, "");
    if (cleanInput.length === 11) {
      setIsValid(validateCPF(cleanInput));
    } else if (cleanInput.length === 14) {
      setIsValid(validateCNPJ(cleanInput));
    } else {
      setIsValid(null); // Pendente de dígitos completos
    }
  }, [inputDoc]);

  return (
    <div className="flex flex-col h-full p-4 gap-5">
       
       {/* Abas */}
       <div className="flex bg-[rgba(255,255,255,0.03)] p-1 rounded-lg border border-[rgba(255,255,255,0.06)]">
           <button
             onClick={() => setDocType("cpf")}
             className={`flex-1 py-1.5 text-[12px] rounded-md transition-colors ${docType === "cpf" ? "bg-[hsl(38,92%,55%,0.15)] text-[hsl(38,92%,55%)] font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
           >
             CPF
           </button>
           <button
             onClick={() => setDocType("cnpj")}
             className={`flex-1 py-1.5 text-[12px] rounded-md transition-colors ${docType === "cnpj" ? "bg-[hsl(38,92%,55%,0.15)] text-[hsl(38,92%,55%)] font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
           >
             CNPJ
           </button>
       </div>

       {/* Gerador */}
       <ToolSection title={`Gerador de ${docType.toUpperCase()}`}>
           <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2">
                   <div className="flex-1 relative">
                       <ToolInput 
                           value={generatedDoc} 
                           readOnly 
                           className="font-mono text-center text-lg pr-10"
                       />
                       <div className="absolute right-2 top-1/2 -translate-y-1/2">
                           <CopyButton value={generatedDoc} />
                       </div>
                   </div>
                   <ToolButton variant="primary" onClick={handleGenerate} className="bg-[hsl(38,92%,55%)] hover:bg-[hsl(38,92%,55%)] text-black px-3 h-10">
                       <RefreshCw size={16} />
                   </ToolButton>
               </div>
               
               <label className="flex items-center gap-2 mt-1 cursor-pointer w-fit">
                   <input 
                       type="checkbox" 
                       checked={useMask} 
                       onChange={(e) => setUseMask(e.target.checked)} 
                       className="rounded border-white/20 bg-white/5 accent-[hsl(38,92%,55%)]"
                   />
                   <span className="text-[11px] text-muted-foreground">Usar pontuação (máscara)</span>
               </label>
           </div>
       </ToolSection>

       <div className="h-px bg-[rgba(255,255,255,0.06)] my-1"></div>

       {/* Validador */}
       <ToolSection title="Validador em Tempo Real">
           <div className="flex flex-col gap-2">
               <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                       <ShieldCheck size={16} />
                   </div>
                   <ToolInput 
                       placeholder="Digite ou cole um CPF/CNPJ..." 
                       value={inputDoc}
                       onChange={(e) => setInputDoc(e.target.value)}
                       className="pl-9 font-mono"
                   />
                   {isValid !== null && (
                       <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-medium ${isValid ? "text-[hsl(142,71%,45%)]" : "text-destructive"}`}>
                           {isValid ? (
                               <><CheckCircle2 size={14} /> VÁLIDO</>
                           ) : (
                               <><XCircle size={14} /> INVÁLIDO</>
                           )}
                       </div>
                   )}
               </div>
               <p className="text-[10px] text-muted-foreground text-center mt-1">
                   O algoritmo valida os dígitos verificadores (matemática oficial).
               </p>
           </div>
       </ToolSection>

    </div>
  );
}
