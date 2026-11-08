import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

const SUPPORT_URL = "https://discord.gg/bpE7tcwNCV";
const EFFECTIVE_DATE = "November 8, 2026";

type LegalKind = "privacy" | "terms";

const privacySections = [
  {
    title: "What B4NDX processes",
    body: "B4NDX Utility is a Discord bot and operations site. The public website source does not include the complete bot data inventory, so the exact Discord fields processed by each command must be confirmed from the bot implementation. Expected examples include server, channel, role, member, command, moderation, ticket, and configuration data needed for enabled features.",
  },
  {
    title: "How information is used",
    body: "The intended use is to provide the enabled moderation, support, onboarding, logging, and utility features. The website describes these workflows, but the bot source is not included in this repository; confirm the precise processing purposes and any logging behavior before treating this page as a complete data notice.",
  },
  {
    title: "What we do not do",
    body: "The website contains no advertising flow and does not ask for a Discord password. The service owner should confirm whether information is ever sold or shared outside the Discord and hosting services required to operate the bot. Never share account passwords, bot tokens, or other secrets through a command, ticket, or support message.",
  },
  {
    title: "Retention and deletion",
    body: "The website source does not establish a verified retention schedule, deletion workflow, or backup policy. Those details must be confirmed from the bot implementation and hosting setup. Removing the bot stops future use in a server; whether stored configuration or logs are deleted automatically must be confirmed by the service owner.",
  },
  {
    title: "Discord and third parties",
    body: "B4NDX Utility relies on Discord and related infrastructure to deliver the service. Discord handles information under its own terms and privacy policy. B4NDX Utility is not operated by Discord and is not endorsed by Discord.",
  },
  {
    title: "Your choices",
    body: "You can stop using the bot, remove it from a server, or limit its permissions. The website provides a support-server route for questions and requests, but the exact verification and deletion process should be confirmed by the service owner.",
  },
];

const termsSections = [
  {
    title: "Using B4NDX Utility",
    body: "B4NDX Utility provides Discord automation features such as moderation helpers, ticket routing, welcome flows, logging, server insight, and utility commands. You may use the service only in servers where you have permission to install or manage bots and only in compliance with Discord's rules.",
  },
  {
    title: "Permissions and responsibility",
    body: "You are responsible for the permissions granted to B4NDX Utility, the server settings you choose, and the actions taken by your staff. Grant only the permissions the server needs. You must not use the bot to evade moderation, harass people, collect secrets, or access data you are not authorized to access.",
  },
  {
    title: "Acceptable use",
    body: "Do not interfere with the service, probe or bypass security controls, overload Discord or B4NDX infrastructure, impersonate B4NDX Utility, distribute malware, or use the service for unlawful activity. We may restrict access when necessary to protect users, servers, Discord, or the service.",
  },
  {
    title: "Third-party platform",
    body: "B4NDX Utility operates inside Discord. Your use of Discord remains subject to Discord's Terms of Service, Community Guidelines, and developer policies. If Discord changes an API or suspends access, a B4NDX feature may change or stop working.",
  },
  {
    title: "Availability and changes",
    body: "We aim to keep B4NDX Utility dependable, but the service is provided on an availability basis and may occasionally be changed, paused, or discontinued for maintenance, security, or product reasons. We may update these terms when the service changes. The date above shows when this version took effect.",
  },
  {
    title: "Disclaimers and liability",
    body: "B4NDX Utility is a tool, not a substitute for server-owner judgment. You remain responsible for moderation decisions, server rules, permissions, and backups. To the extent allowed by law, B4NDX Utility is not responsible for indirect losses, Discord outages, or actions taken by server members or administrators.",
  },
  {
    title: "Contact",
    body: "Questions about these terms or the service can be raised in the B4NDX Utility support server. We may ask for enough information to verify that you are authorized to request changes for a server.",
  },
];

function SectionList({ sections }: { sections: typeof privacySections }) {
  return (
    <div className="legal-section-list">
      {sections.map((section, index) => (
        <section className="legal-section" key={section.title}>
          <div className="legal-section-number">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

export default function Legal({ kind }: { kind: LegalKind }) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const intro = isPrivacy
    ? "A clear account of the information B4NDX Utility handles when it helps run a Discord community."
    : "The rules for using B4NDX Utility responsibly across your Discord community.";
  const sections = isPrivacy ? privacySections : termsSections;

  useEffect(() => {
    document.title = `${title} — B4NDX Utility`;
  }, [title]);

  return (
    <div className="legal-page">
      <header className="legal-header">
        <a
          className="legal-brand"
          href="/"
          aria-label="Back to B4NDX Utility home"
        >
          <span className="legal-brand-mark">B4</span>
          <span>B4NDX Utility</span>
        </a>
        <a className="legal-back" href="/">
          <ArrowLeft size={15} /> Back to site
        </a>
      </header>

      <main className="legal-main">
        <div className="legal-crumb">
          <span /> B4NDX UTILITY / LEGAL
        </div>
        <div className="legal-heading-grid">
          <div>
            <div className="legal-icon" aria-hidden="true">
              {isPrivacy ? <ShieldCheck size={23} /> : <FileText size={23} />}
            </div>
            <h1>{title}</h1>
            <p className="legal-intro">{intro}</p>
          </div>
          <aside className="legal-meta">
            <span>Effective date</span>
            <strong>{EFFECTIVE_DATE}</strong>
            <span>Questions?</span>
            <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
              Open support <ArrowUpRight size={14} />
            </a>
          </aside>
        </div>

        <div className="legal-callout">
          <CheckCircle2 size={17} aria-hidden="true" />
          <p>
            {isPrivacy
              ? "Short version: this page describes the intended data handling for B4NDX Utility, but storage, retention, sharing, and deletion details still require confirmation from the bot implementation and service owner."
              : "Short version: use B4NDX Utility only where you have permission, keep your server responsibilities clear, and follow Discord's rules."}
          </p>
        </div>

        <SectionList sections={sections} />

        <div className="legal-footer-note">
          <p>Need a hand with a request or a server configuration?</p>
          <a
            className="button primary"
            href={SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
          >
            Visit support <ArrowUpRight size={16} />
          </a>
        </div>
      </main>

      <footer className="legal-footer">
        <span>© B4NDX Utility</span>
        <span>Discord bot operations</span>
        <div>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    </div>
  );
}
