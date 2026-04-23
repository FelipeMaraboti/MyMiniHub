import { Settings, LogOut } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function PopupFooter() {
  const [version, setVersion] = useState("0.1.0");

  useEffect(() => {
    invoke<string>("get_app_version")
      .then(setVersion)
      .catch(() => {});
  }, []);

  const handleQuit = () => {
    invoke("plugin:app|exit", { exitCode: 0 }).catch(() => {
      // fallback
      window.close();
    });
  };

  return (
    <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] px-3 py-2 flex items-center justify-between">
      {/* Left: version */}
      <span className="text-[10px] text-muted-foreground/30 font-mono">
        v{version}
      </span>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <FooterButton
          icon={<Settings size={13} strokeWidth={2} />}
          label="Configurações"
          shortcut="⌃,"
          onClick={() => {/* Settings panel — Fase 3 */}}
        />
        <div className="w-px h-3.5 bg-white/10 mx-1" />
        <FooterButton
          icon={<LogOut size={13} strokeWidth={2} />}
          label="Sair"
          shortcut="⌃Q"
          onClick={handleQuit}
          danger
        />
      </div>
    </div>
  );
}

interface FooterButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  onClick: () => void;
  danger?: boolean;
}

function FooterButton({ icon, label, shortcut, onClick, danger }: FooterButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-100
        text-[11px] font-medium
        ${danger
          ? "text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
          : "text-muted-foreground/50 hover:text-foreground hover:bg-white/5"
        }
      `}
    >
      {icon}
      <span>{label}</span>
      <span className="shortcut-badge">{shortcut}</span>
    </button>
  );
}
