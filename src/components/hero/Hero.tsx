import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CommandDesk } from "./CommandDesk";
import GlowTree from "./GlowTree";
import { ArrowRight, ArrowUpRight } from "../icons";
import { INVITE_URL } from "../../lib/site";
import { useMediaQuery, useReducedMotion } from "../../hooks/useMediaQuery";

const MODULE_CHIPS = [
  "Moderation",
  "Tickets",
  "Welcome / Goodbye",
  "Logging",
  "Giveaways",
  "Polls",
] as const;

/**
 * Cinematic hero — 240vh wrapper with a sticky 100vh stage (desktop, motion OK).
 * Scroll progress is written to CSS custom properties (--p, --ph, --pk) inside a
 * rAF loop; every layer derives its transform/opacity from them in pure CSS.
 * No React re-renders happen while scrolling.
 *
 *   --p   raw progress 0..1 across the whole pinned phase
 *   --pf  headline fade 0..1  (fast, out of the way)          p 0.30 → 0.50
 *   --ph  hand-off 0..1  (desk rises to center)               p 0.34 → 0.62
 *   --pk  dock 0..1     (desk settles, module chips appear)   p 0.62 → 0.88
 *
 * On mobile or with prefers-reduced-motion the hero renders static: headline
 * and CTAs above the fold, the desk peeking from the bottom edge. No pinning.
 */
export function Hero() {
  const wrapperRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = !reducedMotion && isDesktop;

  useEffect(() => {
    if (!pinned) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const range = wrapper.offsetHeight - window.innerHeight;
      const p =
        range > 0
          ? Math.min(1, Math.max(0, -wrapper.getBoundingClientRect().top / range))
          : 0;
      wrapper.style.setProperty("--p", p.toFixed(4));
      // Headline fades fast so the rising desk never fights it for attention.
      wrapper.style.setProperty("--pf", Math.min(1, Math.max(0, (p - 0.3) / 0.2)).toFixed(4));
      wrapper.style.setProperty("--ph", Math.min(1, Math.max(0, (p - 0.34) / 0.28)).toFixed(4));
      wrapper.style.setProperty("--pk", Math.min(1, Math.max(0, (p - 0.62) / 0.26)).toFixed(4));
      // Once the headline is fully faded it must also leave the tab order.
      wrapper.dataset.past = p > 0.52 ? "true" : "false";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  return (
    <section
      ref={wrapperRef}
      id="top"
      aria-label="B4NDX Utility introduction"
      data-past="false"
      style={{ "--p": 0, "--pf": 0, "--ph": 0, "--pk": 0 } as CSSProperties}
      className={`relative bg-base-1 ${pinned ? "h-[240vh]" : ""}`}
    >
      {/* NOTE: no overflow-hidden on the section — it would break the sticky
          stage. The inner 100svh stage clips its own layers. */}
      <div
        className={`relative flex min-h-[100svh] flex-col overflow-hidden ${
          pinned ? "lg:h-[100svh] lg:min-h-[640px] lg:sticky lg:top-0" : ""
        }`}
      >
        {/* Layer A — blueprint grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 bg-blueprint mask-vignette"
          style={
            pinned
              ? {
                  transform: "translateY(calc(var(--p) * -6%))",
                  opacity: "calc(1 - var(--p) * 0.6)",
                }
              : undefined
          }
        />
        {/* Single controlled radial glow — no orbs */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(255,92,154,0.08),transparent_70%)]"
        />

        {/* The living tree — full-stage canvas, rooted bottom-right at desktop.
            At rest it carries the hero; as the desk hands off (--ph) the crown
            dims and drifts up so the console takes over cleanly. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-[1] ${
            pinned ? "" : "opacity-60"
          }`}
          style={
            pinned
              ? {
                  opacity: "calc(1 - var(--ph) * 0.78)",
                  transform: "translateY(calc(var(--ph) * -5vh))",
                }
              : undefined
          }
        >
          <GlowTree className="h-full w-full" />
        </div>
        {/* Desktop-only scrim so the headline never fights the crown's glow */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-[2] hidden w-[62%] bg-gradient-to-r from-base-1/90 via-base-1/40 to-transparent lg:block"
        />

        {/* Layer B — headline block */}
        <div
          className="hero-headline relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-10 pt-24 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-[6vh] lg:pt-24"
          style={
            pinned
              ? {
                  transform: "translateY(calc(var(--pf) * -12vh))",
                  opacity: "calc(1 - var(--pf))",
                }
              : undefined
          }
        >
          <p className="eyebrow">
            <span aria-hidden className="h-px w-8 bg-rose-3" />
            A utility bot for Discord servers
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-[clamp(2.35rem,8.5vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink-1 lg:mt-6 lg:text-[clamp(2.6rem,6vw,4.75rem)] lg:leading-[1.04]">
            One bot for the work that keeps a server running.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-[1.7] text-ink-2 sm:text-lg">
            B4NDX Utility handles moderation, support tickets, welcome and
            goodbye messages, logging, giveaways, and polls — configured
            entirely inside Discord, and it never asks for Administrator.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Invite Bot
              <ArrowUpRight />
            </a>
            <Link to="/#modules" className="btn-secondary">
              Explore features
              <ArrowRight />
            </Link>
          </div>

          <p className="mt-7 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-3">
            Scopes: bot + applications.commands
            <span aria-hidden className="mx-2 text-ink-4">·</span>
            No Administrator requested
          </p>
        </div>

        {/* Layer C — product surface.
            Pinned: absolute, rises to center on scroll.
            Mobile/static: a cropped block below the content — CTAs can never
            be covered. */}
        <div
          aria-hidden
          className={`pointer-events-none flex justify-center px-5 ${
            pinned
              ? "absolute inset-x-0 bottom-0 z-[5] lg:px-8"
              : "relative mt-12 h-[34svh] items-start overflow-hidden"
          }`}
          style={
            pinned
              ? {
                  perspective: "1400px",
                  transform:
                    "translateY(calc(58% - var(--ph) * (58% + 30vh) - var(--pk) * 5vh)) scale(calc(0.94 + var(--ph) * 0.06))",
                  opacity: "calc(0.5 + var(--ph) * 0.5 - var(--pk) * 0.22)",
                }
              : undefined
          }
        >
          <div
            className="w-full max-w-3xl"
            style={
              pinned
                ? { transform: "rotateX(calc((1 - var(--ph)) * 6deg))" }
                : undefined
            }
          >
            <CommandDesk />
          </div>
        </div>

        {/* Module chips + scroll cue (pinned only, decorative summary) */}
        {pinned && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex justify-center px-8"
              style={{ opacity: "calc(var(--pk) * 0.95)" }}
            >
              <ul className="flex max-w-4xl flex-wrap justify-center gap-2">
                {MODULE_CHIPS.map((chip, i) => (
                  <li
                    key={chip}
                    className="chip"
                    style={{
                      opacity: `clamp(0, (var(--pk) - ${i * 0.07}) / 0.35, 1)`,
                      transform: `translateY(calc((1 - clamp(0, (var(--pk) - ${i * 0.07}) / 0.35, 1)) * 10px))`,
                    }}
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-rose-1/80" />
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-7 z-10"
              style={{ opacity: "calc(1 - var(--p) * 2.5)" }}
            >
              <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 lg:px-8">
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.24em] text-ink-3">
                  Scroll
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-ink-3/60 to-transparent" />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
