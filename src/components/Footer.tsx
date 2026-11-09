import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { FOOTER_YEAR, INVITE_URL, SUPPORT_SERVER_URL } from "../lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/#modules" },
      { label: "How it works", to: "/#install" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Support server", href: SUPPORT_SERVER_URL },
      { label: "Invite the bot", href: INVITE_URL },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line-1 bg-base-0">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-3">
              A Discord utility bot for moderation, tickets, welcome flows,
              logging, giveaways, and polls — configured entirely inside
              Discord.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) =>
                  "href" in link ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink-2 transition-colors duration-150 hover:text-ink-1"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-ink-2 transition-colors duration-150 hover:text-ink-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-1 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-3">
            © {FOOTER_YEAR} B4NDX Utility. All rights reserved.
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-3">
            Not affiliated with Discord Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
