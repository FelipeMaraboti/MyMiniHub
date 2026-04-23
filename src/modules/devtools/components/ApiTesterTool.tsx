import { useState } from "react";
import { ToolSection, ToolButton, ToolInput } from "@/components/ui/ToolComponents";
import { CopyButton } from "@/components/ui/CopyButton";
import { Play, Plus, Trash2, Clock, Activity } from "lucide-react";
import { fetch } from "@tauri-apps/plugin-http";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Header {
  key: string;
  value: string;
}

export function ApiTesterTool() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  
  const [headers, setHeaders] = useState<Header[]>([{ key: "Accept", value: "application/json" }]);
  const [body, setBody] = useState("{\n  \n}");
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setResponse(null);
    setStatus(null);
    setError(null);
    setTime(null);

    const startTime = performance.now();

    try {
      // Build Headers object
      const reqHeaders: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key.trim() && h.value.trim()) {
          reqHeaders[h.key.trim()] = h.value.trim();
        }
      });

      // Se não for GET/DELETE e tiver body, tenta mandar o body
      const init: RequestInit = {
        method,
        headers: reqHeaders,
      };

      if (method !== "GET" && method !== "DELETE" && body.trim() !== "") {
        init.body = body;
        if (!reqHeaders["Content-Type"]) {
          reqHeaders["Content-Type"] = "application/json";
        }
      }

      // Requisição nativa via Tauri
      const res = await fetch(url, init);
      
      setStatus(res.status);
      
      const text = await res.text();
      try {
        // Tenta formatar se for JSON
        const jsonObj = JSON.parse(text);
        setResponse(JSON.stringify(jsonObj, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setTime(Math.round(performance.now() - startTime));
      setIsLoading(false);
    }
  };

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const updateHeader = (index: number, field: "key" | "value", val: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = val;
    setHeaders(newHeaders);
  };
  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
      
      {/* --- REQUISIÇÃO --- */}
      <ToolSection title="Requisição HTTP">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm rounded-md px-3 font-medium outline-none focus:border-[hsl(38,92%,55%)] w-28"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            
            <ToolInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.exemplo.com/v1/users"
              className="flex-1 font-mono text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            
            <ToolButton 
              variant="primary" 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[hsl(38,92%,55%)] hover:bg-[hsl(38,92%,55%)] text-black font-semibold px-4 w-24"
            >
              {isLoading ? "Enviando..." : <><Play size={14} fill="currentColor"/> Enviar</>}
            </ToolButton>
          </div>
        </div>
      </ToolSection>

      <div className="grid grid-cols-2 gap-4">
        {/* HEADERS */}
        <ToolSection title="Headers">
          <div className="flex flex-col gap-2">
            {headers.map((h, i) => (
              <div key={i} className="flex gap-2">
                <ToolInput 
                  placeholder="Key (ex: Authorization)" 
                  value={h.key} 
                  onChange={e => updateHeader(i, "key", e.target.value)}
                  className="flex-1 text-xs font-mono h-8"
                />
                <ToolInput 
                  placeholder="Value" 
                  value={h.value} 
                  onChange={e => updateHeader(i, "value", e.target.value)}
                  className="flex-1 text-xs font-mono h-8"
                />
                <button onClick={() => removeHeader(i)} className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={addHeader}
              className="text-xs text-[hsl(38,92%,55%)] hover:underline flex items-center gap-1 w-fit mt-1"
            >
              <Plus size={12}/> Adicionar Header
            </button>
          </div>
        </ToolSection>

        {/* BODY */}
        <ToolSection title="Body (Raw JSON)">
           <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={method === "GET" || method === "DELETE"}
            spellCheck={false}
            className={`w-full h-32 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-md p-3 text-[12px] font-mono outline-none focus:border-[hsl(38,92%,55%,0.5)] resize-none ${
              (method === "GET" || method === "DELETE") ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder={`{\n  "key": "value"\n}`}
          />
        </ToolSection>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.06)] my-1"></div>

      {/* --- RESPOSTA --- */}
      <ToolSection title="Resposta">
        <div className="flex flex-col gap-3">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10">
              <Activity size={12} className="text-muted-foreground"/>
              Status: 
              <span className={status && status >= 200 && status < 300 ? "text-[hsl(142,71%,45%)]" : status ? "text-destructive" : "text-muted-foreground"}>
                {status || "---"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10">
              <Clock size={12} className="text-muted-foreground"/>
              Tempo: <span className="text-foreground">{time ? `${time}ms` : "---"}</span>
            </div>
            
            {response && (
              <div className="ml-auto">
                <CopyButton value={response} size="sm" />
              </div>
            )}
          </div>

          {/* Área de Resposta */}
          <div className="relative w-full h-64">
            <textarea
              readOnly
              value={error ? `ERRO INTERNO:\n${error}` : response || ""}
              placeholder="A resposta aparecerá aqui..."
              className={`w-full h-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-md p-3 text-[12px] font-mono outline-none resize-none ${error ? "text-destructive" : "text-foreground"}`}
            />
          </div>
        </div>
      </ToolSection>

    </div>
  );
}
