import { LegalPage, LegalSection } from "./LegalPage";
import { SUPPORT_SERVER_URL } from "../lib/site";

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      documentTitle="Privacy — B4NDX Utility"
      updated="November 2026"
      intro="B4NDX Utility is a Discord bot. This page explains what it processes, what the website itself does and doesn't do, and how you stay in control. The short version: the bot keeps what it needs to run your configuration, the website keeps nothing."
    >
      <LegalSection title="What the bot processes">
        <p>
          To operate, the bot processes identifiers it needs to do its job:
          server IDs, channel IDs, role IDs, and the member IDs involved in the
          actions and events it is asked to handle — for example the staff
          member who runs a moderation command or the members who join a
          giveaway.
        </p>
        <p>
          It also stores the configuration you set up (log channels, welcome
          and goodbye settings, ticket options, and similar), plus the log
          entries and event records your enabled modules produce. Log entries
          are written to the channels you configure, inside your own server.
        </p>
        <p>
          The bot does not sell data, does not run advertising, and does not
          process anything for profiling or tracking purposes.
        </p>
      </LegalSection>

      <LegalSection title="What the website processes">
        <p>
          This website is static. It sets no cookies, loads no analytics
          scripts, and builds no advertising or tracking profiles. Pages are
          served from Cloudflare's network; Cloudflare processes standard
          request data (such as IP addresses) as part of delivering the site,
          under its own privacy policy.
        </p>
      </LegalSection>

      <LegalSection title="Discord's data">
        <p>
          Your Discord account and server data remain governed by Discord's
          own Terms of Service and Privacy Policy. This bot interacts with
          data through Discord's official API and sees only what Discord
          sends it or what server members voluntarily enter in commands.
        </p>
      </LegalSection>

      <LegalSection title="Retention and control">
        <p>
          Configuration and stored entries persist while the bot remains in
          your server, so your setup survives restarts. Removing the bot from
          a server ends its access to that server. If you want stored data
          reviewed or deleted, or you have a question this page doesn't
          answer, ask in the support server.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If data practices change, this page will be updated and the date
          above will reflect the revision.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          The fastest way to reach the people who run B4NDX Utility is the
          support server:{" "}
          <a
            href={SUPPORT_SERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-rose-1 underline-offset-4 hover:underline"
          >
            discord.gg/bpE7tcwNCV
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
