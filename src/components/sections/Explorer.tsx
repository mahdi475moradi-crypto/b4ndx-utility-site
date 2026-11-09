import { useRef, useState, type KeyboardEvent } from "react";
import { EXPLORER_MODULES } from "../../lib/site";
import { Check } from "../icons";

/**
 * Interactive feature explorer — ARIA tabs pattern.
 * Works with mouse, touch, and keyboard (roving tabindex, Arrow / Home / End).
 * Every command pattern is explicitly labeled PREVIEW.
 */
export function Explorer() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeModule = EXPLORER_MODULES[active];

  const select = (index: number, focus = true) => {
    const count = EXPLORER_MODULES.length;
    const next = ((index % count) + count) % count;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        select(active + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        select(active - 1);
        break;
      case "Home":
        event.preventDefault();
        select(0);
        break;
      case "End":
        event.preventDefault();
        select(EXPLORER_MODULES.length - 1);
        break;
    }
  };

  return (
    <div id="explorer" className="mt-16 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3">
          Module explorer
        </h3>
        <p className="hidden font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-4 sm:block">
          Arrow keys, click, or touch
        </p>
      </div>

      <div className="mt-4 grid overflow-hidden rounded-[4px] border border-line-1 bg-base-2 lg:grid-cols-[290px_1fr]">
        {/* Tab list */}
        <div
          role="tablist"
          aria-label="Bot modules"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="grid grid-cols-2 divide-line-1 border-b border-line-1 sm:grid-cols-3 lg:grid-cols-1 lg:divide-y lg:border-b-0 lg:border-r"
        >
          {EXPLORER_MODULES.map((mod, i) => {
            const selected = i === active;
            return (
              <button
                key={mod.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${mod.id}`}
                aria-selected={selected}
                aria-controls={`panel-${mod.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i, false)}
                className={`relative border-l-2 px-4 py-3.5 text-left font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] transition-colors duration-150 lg:py-4 ${
                  selected
                    ? "border-rose-1 bg-base-3 text-ink-1"
                    : "border-transparent text-ink-3 hover:bg-base-3/50 hover:text-ink-2"
                }`}
              >
                <span
                  aria-hidden
                  className={`mr-2.5 inline-block h-1 w-1 rounded-full align-middle ${
                    selected ? "bg-rose-1" : "bg-ink-4"
                  }`}
                />
                {mod.label}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div
          key={activeModule.id}
          role="tabpanel"
          id={`panel-${activeModule.id}`}
          aria-labelledby={`tab-${activeModule.id}`}
          tabIndex={0}
          className="animate-panel p-6 focus-visible:outline-offset-[-2px] sm:p-8 lg:p-10"
        >
          <h4 className="max-w-xl text-balance font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-ink-1 sm:text-2xl">
            {activeModule.headline}
          </h4>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.7] text-ink-2">
            {activeModule.description}
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3">
                What it does
              </p>
              <ul className="mt-4 space-y-2.5">
                {activeModule.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check className="mt-1 size-3.5 shrink-0 text-rose-1" />
                    <span className="text-sm leading-relaxed text-ink-2">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="flex items-center gap-2 font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3">
                Command patterns
                <span className="rounded-[3px] border border-rose-3/50 px-1.5 py-0.5 text-[0.5625rem] text-rose-1">
                  Preview
                </span>
              </p>
              <ul className="mt-4 space-y-2">
                {activeModule.previewCommands.map((cmd) => (
                  <li
                    key={cmd.command}
                    className="rounded-[3px] border border-line-1 bg-base-1 px-3 py-2.5"
                  >
                    <p className="break-words font-mono text-[0.8125rem] text-ink-1">
                      {cmd.command}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-3">{cmd.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 border-t border-line-1 pt-4 text-xs leading-relaxed text-ink-3">
            Command names are interaction previews, not a shipped command list —
            once the bot is in your server, its help command shows the live list,
            and the support server can confirm anything specific.
          </p>
        </div>
      </div>
    </div>
  );
}
