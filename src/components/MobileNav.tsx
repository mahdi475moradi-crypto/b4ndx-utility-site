import { useEffect, useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, DiscordGlyph } from "./icons";
import { INVITE_URL, NAV_LINKS, SUPPORT_SERVER_URL } from "../lib/site";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Accessible mobile navigation dialog:
 * focus trap, Escape to close, body scroll lock, focus returned to the trigger.
 */
export function MobileNav({ open, onClose, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    panel.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.documentElement.style.overflow = "";
      // Return focus to the trigger (or wherever focus came from).
      const target = triggerRef.current ?? previouslyFocused;
      target?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
      {/* Scrim — click to close */}
      <div
        className="absolute inset-0 bg-base-0/80"
        aria-hidden
        onClick={onClose}
      />

      <div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        className="absolute inset-0 overflow-y-auto bg-base-1 pb-10 pt-4 outline-none"
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex h-12 items-center justify-end">
            <button
              type="button"
              className="btn-ghost min-h-0 border border-line-1 p-2.5"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
                <path d="m3.5 3.5 9 9m0-9-9 9" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul className="divide-y divide-line-1 border-y border-line-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-4 font-display text-lg font-semibold text-ink-1"
                      onClick={onClose}
                    >
                      {link.label}
                      <ArrowUpRight className="text-ink-3" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="flex items-center justify-between py-4 font-display text-lg font-semibold text-ink-1"
                      onClick={onClose}
                    >
                      {link.label}
                      <ArrowRight className="text-ink-3" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 grid gap-3">
            <a
              href={INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
              onClick={onClose}
            >
              <DiscordGlyph className="text-rose-ink" />
              Invite Bot
              <ArrowUpRight />
            </a>
            <a
              href={SUPPORT_SERVER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full"
              onClick={onClose}
            >
              Support server
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
