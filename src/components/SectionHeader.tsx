import type { ReactNode } from "react";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}

/** Mono eyebrow + display heading + optional lead, shared by every section. */
export function SectionHeader({ index, label, title, lead }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">
        <span className="eyebrow-index">{index}</span>
        <span aria-hidden className="h-px w-6 bg-line-2" />
        {label}
      </p>
      <h2 className="mt-5 text-balance font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-ink-1">
        {title}
      </h2>
      {lead && <p className="mt-4 text-base leading-[1.7] text-ink-2">{lead}</p>}
    </div>
  );
}
