import { useState, useMemo } from "react";
import { ToolSection, ToolTextarea, ToolButton } from "@/components/ui/ToolComponents";

type DiffLine =
  | { type: "equal"; text: string }
  | { type: "added"; text: string }
  | { type: "removed"; text: string };

/**
 * Diff simples linha a linha (LCS-based approach simplificado).
 * Suficiente para textos pequenos/médios.
 */
function diffLines(a: string, b: string): DiffLine[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");

  // LCS dinâmico
  const m = aLines.length, n = bLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = aLines[i - 1] === bLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: "equal", text: aLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", text: bLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: "removed", text: aLines[i - 1] });
      i--;
    }
  }
  return result;
}

/**
 * DiffCheckerTool — Compara dois textos e mostra diferenças linha a linha.
 */
export function DiffCheckerTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const diff = useMemo(() => {
    if (!showDiff || (!left && !right)) return null;
    return diffLines(left, right);
  }, [left, right, showDiff]);

  const added   = diff?.filter((l) => l.type === "added").length ?? 0;
  const removed = diff?.filter((l) => l.type === "removed").length ?? 0;
  const equal   = diff?.filter((l) => l.type === "equal").length ?? 0;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {!showDiff ? (
        <>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <ToolSection title="Texto A (original)">
              <ToolTextarea
                monospace
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                placeholder="Cole o texto original aqui..."
                className="h-[340px]"
              />
            </ToolSection>
            <ToolSection title="Texto B (modificado)">
              <ToolTextarea
                monospace
                value={right}
                onChange={(e) => setRight(e.target.value)}
                placeholder="Cole o texto modificado aqui..."
                className="h-[340px]"
              />
            </ToolSection>
          </div>
          <div className="flex items-center gap-3">
            <ToolButton
              variant="primary"
              size="md"
              onClick={() => setShowDiff(true)}
              disabled={!left && !right}
            >
              Comparar
            </ToolButton>
            <ToolButton onClick={() => { setLeft(""); setRight(""); }} variant="ghost">
              Limpar
            </ToolButton>
          </div>
        </>
      ) : (
        <>
          {/* Summary */}
          <div className="flex items-center gap-4">
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,45%)] font-medium">
              +{added} adicionadas
            </span>
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-destructive/15 text-destructive font-medium">
              -{removed} removidas
            </span>
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-muted-foreground">
              {equal} iguais
            </span>
            <ToolButton variant="ghost" onClick={() => setShowDiff(false)} className="ml-auto">
              Editar
            </ToolButton>
          </div>

          {/* Diff view */}
          <div className="flex-1 overflow-y-auto rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
            {diff?.map((line, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-1 text-[12px] font-mono ${
                  line.type === "added"
                    ? "bg-[hsl(142,71%,45%,0.08)] text-[hsl(142,71%,55%)]"
                    : line.type === "removed"
                    ? "bg-destructive/8 text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                <span className="w-4 shrink-0 text-[10px] opacity-50">
                  {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all leading-relaxed">
                  {line.text || " "}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
