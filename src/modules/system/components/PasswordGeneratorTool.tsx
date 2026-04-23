import { useState, useEffect } from "react";
import { ToolSection, ToolInput, ToolButton } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";

const CHARSET = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

/**
 * PasswordGeneratorTool — Gerador de senhas customizavel.
 */
export function PasswordGeneratorTool() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    let charset = "";
    if (options.uppercase) charset += CHARSET.uppercase;
    if (options.lowercase) charset += CHARSET.lowercase;
    if (options.numbers) charset += CHARSET.numbers;
    if (options.symbols) charset += CHARSET.symbols;

    if (charset === "") {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStrength = () => {
    let score = 0;
    if (length > 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (options.uppercase) score += 1;
    if (options.lowercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;

    if (score < 4) return { label: "Fraca", color: "text-destructive" };
    if (score < 6) return { label: "Média", color: "text-warning" };
    return { label: "Forte", color: "text-[hsl(142,71%,45%)]" };
  };

  const strength = getStrength();

  return (
    <div className="flex flex-col h-full p-4 gap-6">
      <div className="flex flex-col items-center justify-center p-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] rounded-xl relative">
        <code className="text-2xl font-mono text-foreground tracking-wider break-all text-center">
            {password || "Selecione uma opção"}
        </code>
        <div className="absolute top-3 right-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide">
             <span className={strength.color}>{strength.label}</span>
             {strength.label === "Forte" ? <ShieldCheck size={14} className={strength.color} /> : <ShieldAlert size={14} className={strength.color} />}
        </div>
        <div className="absolute -bottom-4 right-4 flex items-center gap-2">
             <CopyButton value={password} size="md" className="bg-[rgba(18,19,24,1)]" />
             <ToolButton onClick={generatePassword} variant="primary" size="md" className="rounded-md">
                 <RefreshCw size={14} />
             </ToolButton>
        </div>
      </div>

      <ToolSection title="Comprimento">
         <div className="flex items-center gap-4">
             <input
                 type="range"
                 min="4"
                 max="64"
                 value={length}
                 onChange={(e) => setLength(Number(e.target.value))}
                 className="flex-1 accent-accent h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
             />
             <ToolInput
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-16 text-center"
             />
         </div>
      </ToolSection>

      <ToolSection title="Opções">
         <div className="grid grid-cols-2 gap-3">
             <label className="flex items-center gap-3 cursor-pointer text-[13px] text-foreground hover:bg-white/5 p-2 rounded-lg transition-colors">
                 <input type="checkbox" checked={options.uppercase} onChange={() => toggleOption("uppercase")} className="accent-accent w-4 h-4" />
                 Letras Maiúsculas (A-Z)
             </label>
             <label className="flex items-center gap-3 cursor-pointer text-[13px] text-foreground hover:bg-white/5 p-2 rounded-lg transition-colors">
                 <input type="checkbox" checked={options.lowercase} onChange={() => toggleOption("lowercase")} className="accent-accent w-4 h-4" />
                 Letras Minúsculas (a-z)
             </label>
             <label className="flex items-center gap-3 cursor-pointer text-[13px] text-foreground hover:bg-white/5 p-2 rounded-lg transition-colors">
                 <input type="checkbox" checked={options.numbers} onChange={() => toggleOption("numbers")} className="accent-accent w-4 h-4" />
                 Números (0-9)
             </label>
             <label className="flex items-center gap-3 cursor-pointer text-[13px] text-foreground hover:bg-white/5 p-2 rounded-lg transition-colors">
                 <input type="checkbox" checked={options.symbols} onChange={() => toggleOption("symbols")} className="accent-accent w-4 h-4" />
                 Símbolos (!@#$)
             </label>
         </div>
      </ToolSection>
    </div>
  );
}
