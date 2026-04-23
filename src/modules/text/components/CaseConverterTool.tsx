import { useState } from "react";
import { ToolSection, ToolTextarea, ToolButton } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";

/**
 * CaseConverterTool — Converte texto entre diferentes casos (maiusculas, minusculas, etc).
 */
export function CaseConverterTool() {
  const [text, setText] = useState("");

  const handleConvert = (type: string) => {
    if (!text) return;

    let result = text;
    switch (type) {
      case "upper":
        result = text.toUpperCase();
        break;
      case "lower":
        result = text.toLowerCase();
        break;
      case "title":
        result = text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case "sentence":
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "camel":
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "");
        break;
      case "snake":
        result = text
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map((x) => x.toLowerCase())
          .join("_") || text;
        break;
      case "kebab":
        result = text
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map((x) => x.toLowerCase())
          .join("-") || text;
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
            placeholder="Cole ou digite seu texto aqui..."
            className="h-[250px]"
            />
            {text && (
                <div className="absolute top-2 right-2">
                    <CopyButton value={text} />
                </div>
            )}
        </div>
      </ToolSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <ToolButton variant="secondary" onClick={() => handleConvert("upper")}>MAIÚSCULAS</ToolButton>
        <ToolButton variant="secondary" onClick={() => handleConvert("lower")}>minúsculas</ToolButton>
        <ToolButton variant="secondary" onClick={() => handleConvert("title")}>Title Case</ToolButton>
        <ToolButton variant="secondary" onClick={() => handleConvert("sentence")}>Sentence case</ToolButton>
        <ToolButton variant="secondary" onClick={() => handleConvert("camel")}>camelCase</ToolButton>
        <ToolButton variant="secondary" onClick={() => handleConvert("snake")}>snake_case</ToolButton>
        <ToolButton variant="secondary" onClick={() => handleConvert("kebab")}>kebab-case</ToolButton>
        <ToolButton variant="ghost" onClick={() => setText("")} className="col-span-2 sm:col-span-2 text-destructive hover:text-destructive hover:bg-destructive/10">Limpar Texto</ToolButton>
      </div>
    </div>
  );
}
