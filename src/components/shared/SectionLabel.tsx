interface SectionLabelProps {
  label: string;
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <div className="px-3 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
        {label}
      </span>
    </div>
  );
}
