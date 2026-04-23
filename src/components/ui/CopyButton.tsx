import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * CopyButton — Botão copiar com feedback visual "✓ Copiado".
 */
export function CopyButton({ value, className, size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const sizeClass = size === "sm"
    ? "h-7 px-2.5 text-[11px] gap-1.5"
    : "h-8 px-3 text-[12px] gap-2";

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center rounded-md border transition-all duration-150 font-medium shrink-0",
        copied
          ? "border-[hsl(142,71%,45%,0.4)] bg-[hsl(142,71%,45%,0.1)] text-[hsl(142,71%,45%)]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.07)]",
        sizeClass,
        className
      )}
    >
      {copied
        ? <><Check size={11} strokeWidth={2.5} /> Copiado</>
        : <><Copy size={11} strokeWidth={2} /> Copiar</>
      }
    </button>
  );
}
