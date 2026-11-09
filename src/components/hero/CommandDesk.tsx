/**
 * CommandDesk — the hero product surface.
 *
 * A Discord-native control desk rendered entirely in DOM (no imagery): a slash
 * command input with autocomplete, a ticket panel, a log feed, and giveaway /
 * poll strips. The chrome bar carries the mandatory PREVIEW badge so nothing
 * here can be read as a live capture or a shipped command list.
 */
export function CommandDesk() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-[4px] border border-line-2 bg-base-2 text-left shadow-[0_32px_80px_-32px_rgba(0,0,0,0.85)]">
      {/* Chrome bar */}
      <div className="flex h-9 items-center justify-between border-b border-line-1 bg-base-3/60 px-3.5">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose-1" />
          <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
            B4NDX Utility — Server console
          </span>
        </div>
        <span className="rounded-[3px] border border-rose-3/50 px-1.5 py-0.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-rose-1">
          Preview
        </span>
      </div>

      <div className="grid md:grid-cols-[1.08fr_1fr] md:divide-x md:divide-line-1">
        {/* Command input + autocomplete */}
        <div className="border-b border-line-1 p-3.5 md:border-b-0">
          <div className="flex items-center gap-2 rounded-[3px] border border-line-2 bg-base-1 px-3 py-2.5">
            <span aria-hidden className="font-mono text-sm text-ink-3">/</span>
            <span className="font-mono text-sm text-ink-1">ti</span>
            <span
              aria-hidden
              className="h-4 w-px animate-[caret_1.1s_steps(1)_infinite] bg-rose-1"
            />
          </div>

          <ul className="mt-2.5 space-y-1" aria-label="Command suggestions">
            <li className="relative rounded-[3px] border border-line-2 bg-base-3 px-3 py-2">
              <span aria-hidden className="absolute inset-y-1 left-0 w-0.5 bg-rose-1" />
              <p className="font-mono text-[0.8125rem] text-ink-1">
                /ticket <span className="text-ink-3">open</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-3">
                Open a private support channel with staff
              </p>
            </li>
            <li className="rounded-[3px] border border-transparent px-3 py-2">
              <p className="font-mono text-[0.8125rem] text-ink-2">
                /timeout <span className="text-ink-3">@member 10m</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-3">
                Temporarily restrict a member
              </p>
            </li>
            <li className="rounded-[3px] border border-transparent px-3 py-2">
              <p className="font-mono text-[0.8125rem] text-ink-2">
                /giveaway <span className="text-ink-3">start 24h</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-3">
                Run a timed server giveaway
              </p>
            </li>
          </ul>
        </div>

        {/* Ticket + log surfaces */}
        <div className="hidden flex-col divide-y divide-line-1 md:flex">
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
                Ticket #0042
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-ok">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />
                Open
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-2">
              Opened by <span className="font-mono text-ink-1">@hollis</span> —
              billing question about the server subscription
            </p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-[3px] border border-line-2 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-1">
                Claim
              </span>
              <span className="rounded-[3px] border border-transparent px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-3">
                Close
              </span>
            </div>
          </div>

          <div className="p-3.5">
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
              Moderation log
            </span>
            <ul className="mt-2 space-y-1.5 font-mono text-[0.6875rem] leading-relaxed">
              <li className="grid grid-cols-[52px_1fr] gap-2">
                <span className="text-ink-3">22:14</span>
                <span className="text-ink-2">
                  member.ban <span className="text-ink-3">— reason recorded</span>
                </span>
              </li>
              <li className="grid grid-cols-[52px_1fr] gap-2">
                <span className="text-ink-3">22:13</span>
                <span className="text-ink-2">
                  message.purge <span className="text-ink-3">— 12 removed</span>
                </span>
              </li>
              <li className="grid grid-cols-[52px_1fr] gap-2">
                <span className="text-ink-3">22:09</span>
                <span className="text-ink-2">
                  channel.create <span className="text-ink-3">— ticket-0042</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giveaway + poll strip */}
      <div className="hidden border-t border-line-1 md:grid md:grid-cols-2 md:divide-x md:divide-line-1">
        <div className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
              Giveaway
            </span>
            <span className="font-mono text-[0.625rem] text-ink-3">ends 04:12:38</span>
          </div>
          <div aria-hidden className="mt-2.5 h-1 rounded-full bg-base-4">
            <div className="h-1 w-[62%] rounded-full bg-rose-1/80" />
          </div>
        </div>
        <div className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
              Poll
            </span>
            <span className="font-mono text-[0.625rem] text-ink-3">2 options</span>
          </div>
          <div className="mt-2.5 space-y-1.5" aria-hidden>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-base-4">
                <div className="h-1 w-[64%] rounded-full bg-ink-3/70" />
              </div>
              <span className="font-mono text-[0.5625rem] text-ink-3">64</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-base-4">
                <div className="h-1 w-[36%] rounded-full bg-ink-3/40" />
              </div>
              <span className="font-mono text-[0.5625rem] text-ink-3">36</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
