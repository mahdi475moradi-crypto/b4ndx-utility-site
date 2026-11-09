import { FEATURE_GROUPS } from "../../lib/site";
import { SectionHeader } from "../SectionHeader";

/**
 * Feature overview — a spec sheet, not a card grid.
 * Four groups (Protect / Support / Community / Manage), hairline-divided rows,
 * capability titles and details on a strict two-column rhythm.
 */
export function Overview() {
  return (
    <div id="modules" className="scroll-mt-24">
      <SectionHeader
        index="01"
        label="Modules"
        title="Everything a busy server needs. Nothing it doesn't."
        lead="Four groups cover the day-to-day: keeping order, supporting members, running the community side, and handling the small recurring work — all through slash commands inside Discord."
      />

      <div className="mt-14 border-t border-line-1">
        {FEATURE_GROUPS.map((group) => (
          <div
            key={group.name}
            className="grid gap-6 border-b border-line-1 py-10 lg:grid-cols-[300px_1fr] lg:gap-14"
          >
            <div>
              <p className="eyebrow-index">{group.index}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.01em] text-ink-1">
                {group.name}
              </h3>
              <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-ink-3">
                {group.thesis}
              </p>
            </div>

            <ul className="lg:pt-1">
              {group.capabilities.map((cap, i) => (
                <li
                  key={cap.title}
                  className={`grid gap-1.5 py-4 md:grid-cols-[240px_1fr] md:gap-8 ${
                    i > 0 ? "border-t border-line-1" : ""
                  }`}
                >
                  <h4 className="pt-0.5 text-[0.9375rem] font-medium leading-snug text-ink-1">
                    {cap.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-ink-2">
                    {cap.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
