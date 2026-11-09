import { SUPPORT_SERVER_URL } from "../../lib/site";
import { ArrowUpRight, DiscordGlyph } from "../icons";
import { INVITE_URL } from "../../lib/site";

/** Support / community CTA — real invite only, no community-size claims. */
export function SupportCta() {
  return (
    <div className="relative overflow-hidden rounded-[4px] border border-line-1 bg-base-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-1/60 to-transparent"
      />
      <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14 lg:p-12">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span aria-hidden className="h-px w-8 bg-rose-3" />
            Support
          </p>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-ink-1">
            Need a hand setting it up?
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-2">
            The support server is where setup questions get answered, bugs get
            reported, and module ideas land — staffed by the people who build
            the bot.
          </p>
          <p className="mt-4">
            <span className="chip">discord.gg/bpE7tcwNCV</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:w-56">
          <a
            href={SUPPORT_SERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <DiscordGlyph className="text-rose-ink" />
            Join support server
            <ArrowUpRight />
          </a>
          <a
            href={INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Invite Bot
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </div>
  );
}
