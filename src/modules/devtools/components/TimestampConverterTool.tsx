import { useState, useEffect } from "react";
import { ToolSection, ToolInput, ToolButton } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw } from "lucide-react";

function formatDate(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function toISO(date: Date): string {
  return date.toISOString();
}

/**
 * TimestampConverterTool — Converte timestamps Unix ↔ datas legíveis.
 */
export function TimestampConverterTool() {
  const [now, setNow] = useState(Date.now());
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsUnit, setTsUnit] = useState<"ms" | "s">("ms");

  // Tick a cada segundo
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Converter timestamp → data
  const tsMs = tsInput
    ? tsUnit === "s" ? +tsInput * 1000 : +tsInput
    : null;
  const tsDate = tsMs && !isNaN(tsMs) ? new Date(tsMs) : null;
  const tsResult = tsDate ? {
    local: formatDate(tsDate),
    iso:   toISO(tsDate),
    utc:   tsDate.toUTCString(),
  } : null;

  // Converter data → timestamp
  const parsedDate = dateInput ? new Date(dateInput) : null;
  const dateTs = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getTime() : null;

  return (
    <div className="flex flex-col h-full p-4 gap-5 overflow-y-auto">
      {/* Live "agora" */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)]">
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Agora (live)</p>
          <p className="text-[13px] font-mono text-foreground mt-0.5">{now}</p>
          <p className="text-[11.5px] text-muted-foreground">{formatDate(new Date(now))}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={String(now)} />
          <CopyButton value={String(Math.floor(now / 1000))} />
        </div>
      </div>

      {/* Timestamp → Data */}
      <ToolSection title="Unix Timestamp → Data">
        <div className="flex items-center gap-2">
          <ToolInput
            type="number"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="ex: 1713800000000"
            monospace
            className="flex-1"
          />
          <div className="flex gap-1">
            {(["ms", "s"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setTsUnit(u)}
                className={`px-3 h-9 rounded-lg text-[12px] font-medium border transition-colors ${
                  tsUnit === u
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          <ToolButton variant="ghost" onClick={() => setTsInput("")}>
            <RefreshCw size={12} />
          </ToolButton>
        </div>

        {tsResult && (
          <div className="flex flex-col gap-1.5 mt-1">
            {[
              { label: "Local", value: tsResult.local },
              { label: "ISO 8601", value: tsResult.iso },
              { label: "UTC", value: tsResult.utc },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
                  <p className="text-[12px] font-mono text-foreground">{value}</p>
                </div>
                <CopyButton value={value} />
              </div>
            ))}
          </div>
        )}
      </ToolSection>

      {/* Data → Timestamp */}
      <ToolSection title="Data → Unix Timestamp">
        <ToolInput
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="flex-1"
        />

        {dateTs && (
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] mt-1">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Milliseconds</p>
              <p className="text-[12px] font-mono text-foreground">{dateTs}</p>
            </div>
            <div className="flex gap-2">
              <CopyButton value={String(Math.floor(dateTs / 1000))} />
              <CopyButton value={String(dateTs)} />
            </div>
          </div>
        )}
      </ToolSection>
    </div>
  );
}
