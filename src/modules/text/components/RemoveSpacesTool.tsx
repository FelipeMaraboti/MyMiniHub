import { useState } from "react";
import { ToolSection, ToolTextarea, ToolButton } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";

/**
 * RemoveSpacesTool — Remove espacos extras, linhas em branco e limpa textos.
 */
export function RemoveSpacesTool() {
  const [text, setText] = useState("");

  const handleAction = (action: string) => {
    if (!text) return;

    let result = text;
    switch (action) {
      case "extra-spaces":
        result = text.replace(/[ \t]{2,}/g, " ").trim();
        break;
      case "empty-lines":
        result = text.replace(/^\s*[\r\n]/gm, "");
        break;
      case "all-spaces":
        result = text.replace(/\s+/g, "");
        break;
      case "trim-lines":
        result = text.split("\n").map(line => line.trim()).join("\n");
        break;
    }
    setText(result);
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <ToolSection title="Texto">
        <div className="relative">
          <ToolTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole o texto aqui..."
            className="h-[250px]"
          />
          {text && (
            <div className="absolute top-2 right-2">
              <CopyButton value={text} />
            </div>
          )}
        </div>
      </ToolSection>

      <div className="grid grid-cols-2 gap-2">
        <ToolButton variant="secondary" onClick={() => handleAction("extra-spaces")}>
          Remover espaços extras
        </ToolButton>
        <ToolButton variant="secondary" onClick={() => handleAction("empty-lines")}>
          Remover linhas em branco
        </ToolButton>
        <ToolButton variant="secondary" onClick={() => handleAction("trim-lines")}>
          Limpar pontas das linhas (Trim)
        </ToolButton>
        <ToolButton variant="secondary" onClick={() => handleAction("all-spaces")}>
          Remover TODOS os espaços
        </ToolButton>
      </div>

      <div className="flex justify-center mt-2">
         <ToolButton variant="ghost" onClick={() => setText("")} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          Limpar Texto
        </ToolButton>
      </div>
    </div>
  );
}
