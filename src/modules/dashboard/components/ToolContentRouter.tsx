import { lazy, Suspense } from "react";

// ── Dev Tools ─────────────────────────────────────────────────
const JsonFormatterTool     = lazy(() => import("@/modules/devtools/components/JsonFormatterTool").then(m => ({ default: m.JsonFormatterTool })));
const UuidGeneratorTool     = lazy(() => import("@/modules/devtools/components/UuidGeneratorTool").then(m => ({ default: m.UuidGeneratorTool })));
const Base64Tool            = lazy(() => import("@/modules/devtools/components/Base64Tool").then(m => ({ default: m.Base64Tool })));
const TimestampConverterTool= lazy(() => import("@/modules/devtools/components/TimestampConverterTool").then(m => ({ default: m.TimestampConverterTool })));
const HashGeneratorTool     = lazy(() => import("@/modules/devtools/components/HashGeneratorTool").then(m => ({ default: m.HashGeneratorTool })));
const DiffCheckerTool       = lazy(() => import("@/modules/devtools/components/DiffCheckerTool").then(m => ({ default: m.DiffCheckerTool })));
const DocsBrTool            = lazy(() => import("@/modules/devtools/components/DocsBrTool").then(m => ({ default: m.DocsBrTool })));
const ApiTesterTool         = lazy(() => import("@/modules/devtools/components/ApiTesterTool").then(m => ({ default: m.ApiTesterTool })));

// ── Text Tools ────────────────────────────────────────────────
const WordCounterTool  = lazy(() => import("@/modules/text/components/WordCounterTool").then(m => ({ default: m.WordCounterTool })));
const CaseConverterTool= lazy(() => import("@/modules/text/components/CaseConverterTool").then(m => ({ default: m.CaseConverterTool })));
const RemoveSpacesTool = lazy(() => import("@/modules/text/components/RemoveSpacesTool").then(m => ({ default: m.RemoveSpacesTool })));
const QuickNotesTool   = lazy(() => import("@/modules/text/components/QuickNotesTool").then(m => ({ default: m.QuickNotesTool })));

// ── Productivity ──────────────────────────────────────────────
const PomodoroTool   = lazy(() => import("@/modules/productivity/components/PomodoroTool").then(m => ({ default: m.PomodoroTool })));
const StopwatchTool  = lazy(() => import("@/modules/productivity/components/StopwatchTool").then(m => ({ default: m.StopwatchTool })));
const ChecklistTool  = lazy(() => import("@/modules/productivity/components/ChecklistTool").then(m => ({ default: m.ChecklistTool })));

// ── System ────────────────────────────────────────────────────
const PasswordGeneratorTool = lazy(() => import("@/modules/system/components/PasswordGeneratorTool").then(m => ({ default: m.PasswordGeneratorTool })));
const ClipboardHistoryTool  = lazy(() => import("@/modules/system/components/ClipboardHistoryTool").then(m => ({ default: m.ClipboardHistoryTool })));
const SettingsTool          = lazy(() => import("@/modules/system/components/SettingsTool").then(m => ({ default: m.SettingsTool })));

// ── Files / Images ────────────────────────────────────────────
const MergePdfTool      = lazy(() => import("@/modules/files/components/MergePdfTool").then(m => ({ default: m.MergePdfTool })));
const SplitPdfTool      = lazy(() => import("@/modules/files/components/SplitPdfTool").then(m => ({ default: m.SplitPdfTool })));
const ImageToPdfTool    = lazy(() => import("@/modules/files/components/ImageToPdfTool").then(m => ({ default: m.ImageToPdfTool })));
const ConvertImageTool  = lazy(() => import("@/modules/images/components/ConvertImageTool").then(m => ({ default: m.ConvertImageTool })));
const CompressImageTool = lazy(() => import("@/modules/images/components/CompressImageTool").then(m => ({ default: m.CompressImageTool })));
const ResizeImageTool   = lazy(() => import("@/modules/images/components/ResizeImageTool").then(m => ({ default: m.ResizeImageTool })));
const BatchRenameTool   = lazy(() => import("@/modules/files/components/BatchRenameTool").then(m => ({ default: m.BatchRenameTool })));

// ─────────────────────────────────────────────────────────────

const TOOL_MAP: Record<string, React.LazyExoticComponent<React.FC>> = {
  // Dev Tools
  "json-formatter":       JsonFormatterTool,
  "uuid-generator":       UuidGeneratorTool,
  "base64":               Base64Tool,
  "timestamp-converter":  TimestampConverterTool,
  "hash-generator":       HashGeneratorTool,
  "diff-checker":         DiffCheckerTool,
  "docs-br":              DocsBrTool,
  "api-tester":           ApiTesterTool,
  // Text
  "word-counter":         WordCounterTool,
  "case-converter":       CaseConverterTool,
  "remove-spaces":        RemoveSpacesTool,
  "quick-notes":          QuickNotesTool,
  // Productivity
  "pomodoro":             PomodoroTool,
  "stopwatch":            StopwatchTool,
  "checklist":            ChecklistTool,
  // System
  "password-generator":   PasswordGeneratorTool,
  "clipboard-history":    ClipboardHistoryTool,
  "settings":             SettingsTool,
  // Files
  "merge-pdf":            MergePdfTool,
  "split-pdf":            SplitPdfTool,
  "image-to-pdf":         ImageToPdfTool,
  "convert-image":        ConvertImageTool,
  "compress-image":       CompressImageTool,
  "resize-image":         ResizeImageTool,
  "batch-rename":         BatchRenameTool,
};

function ToolFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        <p className="text-[12px] text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

interface ToolContentRouterProps {
  toolId: string;
}

/**
 * ToolContentRouter — Renderiza a ferramenta correta via lazy import.
 * Cada componente é carregado só quando necessário.
 */
export function ToolContentRouter({ toolId }: ToolContentRouterProps) {
  const Component = TOOL_MAP[toolId];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[12px] text-muted-foreground">
          Ferramenta "<span className="font-mono text-foreground">{toolId}</span>" não registrada.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<ToolFallback />}>
      <Component />
    </Suspense>
  );
}
