"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INVITE_URL, SUPPORT_URL } from "@/lib/bot";

export function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="#top" className="group flex items-center gap-2.5" aria-label="B4NDX home">
      <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-[13px] font-bold tracking-tight text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
        B4
      </span>
      <span className="font-display font-bold tracking-tight text-lg leading-none">
        B4NDX
        {!compact && (
          <span className="block text-[10px] font-medium tracking-[0.28em] text-muted-foreground mt-0.5">
            UTILITY
          </span>
        )}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */

export function AddButton({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <a
      href={INVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-black/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      <DiscordMark className="size-[18px] shrink-0" />
      <span className={compact ? "sm:hidden" : "hidden sm:inline"}>
        {compact ? "Add" : "Add to Discord"}
      </span>
      {compact && <span className="hidden sm:inline">Add to Discord</span>}
    </a>
  );
}

/* ------------------------------------------------------------------ */

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/72 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Wordmark />
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="#preview"
            className="hidden sm:inline-flex h-10 items-center rounded-lg px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </Link>
          <Link
            href="#faq"
            className="hidden sm:inline-flex h-10 items-center rounded-lg px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Support
          </a>
          <AddButton className="ml-1 h-10 px-4" compact />
        </div>
      </nav>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */

const PRIVACY = [
  "B4NDX stores only what it needs to run: your server's ID, its settings, and message content when a command or autoresponder needs it.",
  "Nothing is sold, shared, or sent anywhere else. No ads, no tracking, no analytics on your members.",
  "Kick the bot and the data it keeps for your server goes with it.",
];

const TERMS = [
  "B4NDX is free and provided as is, with no uptime guarantees.",
  "Keep your server within Discord's terms of service and local law. Don't use the bot to break either.",
  "Features may change or be removed as the bot grows. The service can be paused for maintenance at any time.",
];

export function Footer() {
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);

  return (
    <footer className="relative z-10 mt-auto border-t border-border bg-background/60 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 pb-[max(3rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div className="max-w-xs">
            <Wordmark compact />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A free Discord bot. One command,{" "}
              <code className="rounded border border-border bg-secondary/60 px-1 py-px font-mono text-[0.85em] text-primary">
                !help
              </code>
              , tells you everything it does.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Bot
              </p>
              <ul className="mt-3.5 space-y-2.5 text-sm">
                <li>
                  <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                    Add B4NDX
                  </a>
                </li>
                <li>
                  <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                    Support server
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Legal
              </p>
              <ul className="mt-3.5 space-y-2.5 text-sm">
                <li>
                  <button onClick={() => setLegal("privacy")} className="text-muted-foreground transition-colors hover:text-foreground">
                    Privacy
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegal("terms")} className="text-muted-foreground transition-colors hover:text-foreground">
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground/70">
          <p>© 2026 B4NDX · built by one person</p>
          <p className="flex items-center gap-1.5">
            <span className="soft-pulse inline-block size-1.5 rounded-full bg-[#23a55a]" />
            online (usually)
          </p>
          <p>Not affiliated with Discord Inc.</p>
        </div>
      </div>

      <Dialog open={legal !== null} onOpenChange={(o) => !o && setLegal(null)}>
        <DialogContent className="max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-left">
              {legal === "privacy" ? "Privacy" : "Terms"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1 text-left text-sm leading-relaxed text-muted-foreground">
                {(legal === "privacy" ? PRIVACY : TERMS).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
