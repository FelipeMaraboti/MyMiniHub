import { useState } from "react";
import { ToolSection, ToolButton, ToolInput, ToolSelect } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw, Copy, Check } from "lucide-react";

type UuidVersion = "v4" | "v1" | "v7";

function generateV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateV1(): string {
  // Pseudo V1: timestamp-based (simplified)
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, "0");
  const rand = Math.random().toString(16).slice(2, 6);
  const node = Math.random().toString(16).slice(2, 14).padStart(12, "0");
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${rand}-${
    (((Math.random() * 16) | 0) & 0x3 | 0x8).toString(16)
  }${Math.random().toString(16).slice(2, 5)}-${node}`;
}

function generateV7(): string {
  // V7: Unix timestamp ms prefix + random
  const ts = Date.now().toString(16).padStart(12, "0");
  const rand = () => Math.random().toString(16).slice(2, 6);
  return `${ts.slice(0, 8)}-${ts.slice(8, 12)}-7${rand()}-${
    (((Math.random() * 16) | 0) & 0x3 | 0x8).toString(16)
  }${rand()}-${rand()}${rand()}${rand().slice(0, 2)}`;
}

function generate(version: UuidVersion): string {
  switch (version) {
    case "v1": return generateV1();
    case "v7": return generateV7();
    default:   return generateV4();
  }
}

/**
 * UuidGeneratorTool — Gera UUIDs v1, v4 e v7 em lote.
 */
export function UuidGeneratorTool() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => generateV4()));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const regenerate = () => {
    setUuids(Array.from({ length: count }, () => generate(version)));
  };

  const copyOne = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const allText = uuids.join("\n");

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Controls */}
      <ToolSection title="Configuração">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] text-muted-foreground">Versão</label>
            <ToolSelect
              value={version}
              onChange={(e) => setVersion(e.target.value as UuidVersion)}
            >
              <option value="v4">UUID v4 (aleatório)</option>
              <option value="v1">UUID v1 (timestamp)</option>
              <option value="v7">UUID v7 (sortable)</option>
            </ToolSelect>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-muted-foreground">Quantidade</label>
            <ToolInput
              type="number"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, +e.target.value)))}
              className="w-24"
              min={1}
              max={100}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-muted-foreground opacity-0">.</label>
            <ToolButton variant="primary" onClick={regenerate}>
              <RefreshCw size={13} /> Gerar
            </ToolButton>
          </div>
        </div>
      </ToolSection>

      {/* UUID List */}
      <ToolSection title={`${uuids.length} UUID${uuids.length !== 1 ? "s" : ""} gerado${uuids.length !== 1 ? "s" : ""}`}>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[340px] pr-1">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-colors"
            >
              <code className="text-[12px] text-foreground font-mono flex-1 select-text">{uuid}</code>
              <button
                onClick={() => copyOne(uuid, i)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
              >
                {copiedIndex === i
                  ? <Check size={13} className="text-[hsl(142,71%,45%)]" />
                  : <Copy size={13} />
                }
              </button>
            </div>
          ))}
        </div>
      </ToolSection>

      {/* Copy All */}
      <div className="flex justify-end pt-1 border-t border-[rgba(255,255,255,0.06)]">
        <CopyButton value={allText} size="md" />
      </div>
    </div>
  );
}
