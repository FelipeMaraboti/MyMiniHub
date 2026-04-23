import { useState, useEffect } from "react";
import { ToolSection, ToolTextarea } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";

type Mode = "encode" | "decode";

/**
 * Base64Tool — Codifica e decodifica Base64 em tempo real.
 */
export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
        setError("");
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
        setError("");
      }
    } catch {
      setOutput("");
      setError(mode === "decode" ? "Base64 inválido." : "Erro ao codificar.");
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] w-fit">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(""); setOutput(""); }}
            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              mode === m
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "encode" ? "Codificar" : "Decodificar"}
          </button>
        ))}
      </div>

      {/* Input */}
      <ToolSection title={mode === "encode" ? "Texto de entrada" : "Base64 de entrada"}>
        <ToolTextarea
          monospace={mode === "decode"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Digite o texto para codificar..."
              : "Cole o Base64 para decodificar..."
          }
          className="h-[200px]"
        />
      </ToolSection>

      {/* Swap */}
      {output && !error && (
        <button
          onClick={toggleMode}
          className="self-center text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 py-1 px-3 rounded-md border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]"
        >
          ⇅ Inverter modo (usar resultado como entrada)
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="text-[11.5px] text-destructive px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          {error}
        </p>
      )}

      {/* Output */}
      {output && !error && (
        <ToolSection title={mode === "encode" ? "Base64 codificado" : "Texto decodificado"}>
          <div className="relative">
            <ToolTextarea
              monospace={mode === "encode"}
              value={output}
              readOnly
              className="h-[180px] text-[hsl(142,71%,45%)]"
            />
            <div className="absolute top-2 right-2">
              <CopyButton value={output} />
            </div>
          </div>
        </ToolSection>
      )}
    </div>
  );
}
