import { useState, useCallback } from "react";
import { ToolSection, ToolTextarea, ToolButton } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { AlertCircle, CheckCircle2, Minimize2 } from "lucide-react";

type Status = "idle" | "valid" | "error";

/**
 * JsonFormatterTool — Formata, valida e minifica JSON.
 */
export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus("valid");
      setError("");
    } catch (e: unknown) {
      setStatus("error");
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus("valid");
      setError("");
    } catch (e: unknown) {
      setStatus("error");
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const clear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setError("");
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Input */}
      <ToolSection title="JSON de entrada">
        <ToolTextarea
          monospace
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"exemplo": "cole seu JSON aqui"}'
          className="h-[220px]"
        />
      </ToolSection>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ToolButton variant="primary" onClick={format}>
          <CheckCircle2 size={13} /> Formatar
        </ToolButton>
        <ToolButton onClick={minify}>
          <Minimize2 size={13} /> Minificar
        </ToolButton>

        <div className="flex items-center gap-2 ml-auto text-[12px] text-muted-foreground">
          <span>Indent:</span>
          {[2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                indent === n
                  ? "border-accent/60 text-accent bg-accent/10"
                  : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <ToolButton variant="ghost" onClick={clear} className="text-muted-foreground text-[11px]">
          Limpar
        </ToolButton>
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle size={14} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-destructive font-mono leading-relaxed">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && (
        <ToolSection title="Resultado">
          <div className="relative">
            <ToolTextarea
              monospace
              value={output}
              readOnly
              className="h-[200px] text-[hsl(142,71%,45%)] bg-[rgba(142,71%,45%,0.03)]"
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
