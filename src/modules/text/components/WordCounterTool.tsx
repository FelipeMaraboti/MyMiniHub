import { useMemo } from "react";
import { ToolSection, ToolTextarea } from "@/components/ui/ToolComponents";

function countStats(text: string) {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const paragraphs = text === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const sentences = text === "" ? 0 : (text.match(/[.!?]+/g) ?? []).length;
  const readingTime = Math.max(1, Math.ceil(words / 200)); // ~200 wpm
  return { chars, charsNoSpaces, words, lines, paragraphs, sentences, readingTime };
}

const STAT_ITEMS = [
  { key: "words",          label: "Palavras",              color: "text-[hsl(142,71%,45%)]" },
  { key: "chars",          label: "Caracteres",            color: "text-[hsl(199,89%,55%)]" },
  { key: "charsNoSpaces",  label: "Chars (sem espaços)",   color: "text-[hsl(199,89%,55%)]" },
  { key: "lines",          label: "Linhas",                color: "text-[hsl(38,92%,55%)]" },
  { key: "paragraphs",     label: "Parágrafos",            color: "text-[hsl(262,80%,65%)]" },
  { key: "sentences",      label: "Frases",                color: "text-[hsl(326,80%,62%)]" },
  { key: "readingTime",    label: "Tempo de leitura (min)",color: "text-muted-foreground" },
] as const;

/**
 * WordCounterTool — Conta palavras, caracteres, linhas, parágrafos e frases.
 */
export function WordCounterTool() {
  const [text, setText] = React.useState("");
  const stats = useMemo(() => countStats(text), [text]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <ToolSection title="Texto">
        <ToolTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole ou escreva seu texto aqui..."
          className="h-[230px]"
        />
      </ToolSection>

      <div className="grid grid-cols-2 gap-2">
        {STAT_ITEMS.map(({ key, label, color }) => (
          <div
            key={key}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
          >
            <span className="text-[12px] text-muted-foreground">{label}</span>
            <span className={`text-[18px] font-semibold tabular-nums ${color}`}>
              {stats[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
