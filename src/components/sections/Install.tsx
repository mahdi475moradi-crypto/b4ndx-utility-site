import { INSTALL_STEPS } from "../../lib/site";
import { SectionHeader } from "../SectionHeader";
import { ArrowUpRight } from "../icons";
import { INVITE_URL } from "../../lib/site";

/** 5-step install flow with the real invite inline at step one. */
export function Install() {
  return (
    <div id="install" className="scroll-mt-24">
      <SectionHeader
        index="02"
        label="Add the bot"
        title="Live in your server in about two minutes."
        lead="Discord's official authorization flow does the heavy lifting. You approve once, configure once, and the bot stays out of the way after that."
      />

      <ol className="relative mt-14 space-y-10 border-l border-line-1 pl-8 lg:pl-12">
        {INSTALL_STEPS.map((step, i) => (
          <li key={step.title} className="relative">
            <span
              aria-hidden
              className="absolute -left-[41px] flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-line-2 bg-base-2 font-mono text-[0.625rem] font-medium text-rose-1 lg:-left-[55px]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[1.0625rem] font-semibold text-ink-1">
              {step.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-[1.7] text-ink-2">
              {step.detail}
            </p>
            {i === 0 && (
              <a
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5"
              >
                Open the invite
                <ArrowUpRight />
              </a>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-[4px] border border-line-1 bg-base-2 px-5 py-4">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3">
          <span>Requires: Manage Server on the target guild</span>
          <span aria-hidden className="text-ink-4">·</span>
          <span>Scopes: bot + applications.commands</span>
          <span aria-hidden className="text-ink-4">·</span>
          <span className="text-rose-1">Administrator: never requested</span>
        </p>
      </div>
    </div>
  );
}
