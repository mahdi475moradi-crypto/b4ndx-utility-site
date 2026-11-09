import { BOT_PERMISSIONS, INVITE_URL } from "../../lib/site";
import { SectionHeader } from "../SectionHeader";
import { ArrowUpRight } from "../icons";

/**
 * Permissions honesty section: the exact scope + permission list the invite
 * requests, with a one-line reason for each. No Administrator, ever.
 */
export function Permissions() {
  return (
    <div id="permissions" className="scroll-mt-24">
      <SectionHeader
        index="03"
        label="Permissions"
        title="It asks for what it needs. That is the whole list."
        lead="Every Discord bot authorization shows you the permissions it wants before you approve it. Here is what B4NDX Utility asks for, and why each line exists — so nothing on the consent screen is a surprise."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Permission table */}
        <div className="overflow-hidden rounded-[4px] border border-line-1 bg-base-2">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Permissions requested by the B4NDX Utility invite and the reason
              for each
            </caption>
            <thead>
              <tr className="border-b border-line-1 bg-base-3/60">
                <th
                  scope="col"
                  className="px-5 py-3.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3"
                >
                  Permission
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3"
                >
                  Why it's requested
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-1">
              {BOT_PERMISSIONS.map((perm) => (
                <tr key={perm.name} className="transition-colors duration-150 hover:bg-base-3/40">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-5 py-3.5 font-mono text-[0.8125rem] font-medium text-ink-1"
                  >
                    {perm.name}
                  </th>
                  <td className="px-5 py-3.5 text-sm leading-relaxed text-ink-2">
                    {perm.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Side notes */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[4px] border border-line-1 bg-base-2 p-5">
            <h3 className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3">
              Scopes requested
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip text-ink-1">bot</span>
              <span className="chip text-ink-1">applications.commands</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              The <span className="font-mono text-ink-1">bot</span> scope puts
              the bot in your server;{" "}
              <span className="font-mono text-ink-1">applications.commands</span>{" "}
              registers its slash commands. Nothing else.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[4px] border border-line-1 bg-base-2 p-5">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-0.5 bg-rose-1"
            />
            <h3 className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-rose-1">
              Not requested
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              <span className="font-mono text-ink-1">Administrator</span> — the
              all-everything permission no utility bot should ask for. You can
              also uncheck anything from the list at authorize time; features
              that rely on it simply won't run.
            </p>
          </div>

          <div className="rounded-[4px] border border-line-1 bg-base-2 p-5">
            <h3 className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3">
              Verify it yourself
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              The invite opens Discord's own authorization page, which displays
              exactly this list before you confirm.
            </p>
            <a
              href={INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-4 w-full"
            >
              Review the invite
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
