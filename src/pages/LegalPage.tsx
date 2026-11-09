import type { ReactNode } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

interface LegalPageProps {
  title: string;
  documentTitle: string;
  updated: string;
  intro: string;
  children: ReactNode;
}

/** Shared layout for /privacy and /terms. */
export function LegalPage({ title, documentTitle, updated, intro, children }: LegalPageProps) {
  useDocumentTitle(documentTitle);

  return (
    <main id="content" className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:pt-32 lg:px-8">
      <p className="eyebrow">
        <span aria-hidden className="h-px w-8 bg-rose-3" />
        Legal
      </p>
      <h1 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-1">
        {title}
      </h1>
      <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
        Last updated: {updated}
      </p>
      <p className="mt-8 text-[1.0625rem] leading-[1.75] text-ink-2">{intro}</p>

      <div className="mt-12 space-y-10 border-t border-line-1 pt-10">{children}</div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-ink-1">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.75] text-ink-2">
        {children}
      </div>
    </section>
  );
}
