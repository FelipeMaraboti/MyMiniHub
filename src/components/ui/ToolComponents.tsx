import { cn } from "@/utils";

interface ToolSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * ToolSection — Container de seção dentro de uma tool window.
 * Agrupa label + conteúdo com espaçamento consistente.
 */
export function ToolSection({ title, children, className }: ToolSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title && (
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      )}
      {children}
    </div>
  );
}

interface ToolTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  monospace?: boolean;
}

/**
 * ToolTextarea — Textarea estilizada no design system.
 */
export function ToolTextarea({ className, monospace = false, ...props }: ToolTextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]",
        "px-3 py-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground/40",
        "focus:outline-none focus:border-[rgba(255,255,255,0.15)] focus:bg-[rgba(255,255,255,0.05)]",
        "transition-colors duration-150 scrollbar-thin",
        monospace && "font-mono",
        className
      )}
      {...props}
    />
  );
}

interface ToolInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  monospace?: boolean;
}

/**
 * ToolInput — Input estilizado no design system.
 */
export function ToolInput({ className, monospace = false, ...props }: ToolInputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]",
        "px-3 h-9 text-[12.5px] text-foreground placeholder:text-muted-foreground/40",
        "focus:outline-none focus:border-[rgba(255,255,255,0.15)] focus:bg-[rgba(255,255,255,0.05)]",
        "transition-colors duration-150",
        monospace && "font-mono",
        className
      )}
      {...props}
    />
  );
}

interface ToolSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

/**
 * ToolSelect — Select estilizado no design system.
 */
export function ToolSelect({ className, children, ...props }: ToolSelectProps) {
  return (
    <select
      className={cn(
        "rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)]",
        "px-3 h-9 text-[12.5px] text-foreground",
        "focus:outline-none focus:border-[rgba(255,255,255,0.15)]",
        "transition-colors duration-150 cursor-pointer appearance-none pr-8",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

/**
 * ToolButton — Botão de ação dentro das ferramentas.
 */
export function ToolButton({
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}: ToolButtonProps) {
  const baseClass = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";

  const variantClass = {
    primary: "bg-accent text-accent-foreground hover:brightness-110",
    secondary: "border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-foreground hover:bg-[rgba(255,255,255,0.09)]",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)]",
  }[variant];

  const sizeClass = size === "sm"
    ? "h-8 px-3 text-[12px]"
    : "h-9 px-4 text-[13px]";

  return (
    <button className={cn(baseClass, variantClass, sizeClass, className)} {...props}>
      {children}
    </button>
  );
}
