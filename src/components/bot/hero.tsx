"use client";

import { motion } from "framer-motion";
import { AddButton } from "@/components/bot/chrome";
import { SUPPORT_URL } from "@/lib/bot";

const rise = {
  hidden: { y: "108%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.3 + i * 0.14, ease: [0.2, 0.8, 0.2, 1] as const },
  }),
};

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Intro"
      className="relative z-10 flex min-h-[100svh] items-center"
    >
      {/* readability veil over the tree — mobile only (tree sits behind the
          copy there); desktop keeps the tree clear on the right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-background/45 md:bg-transparent"
      />
      {/* desktop: soft left scrim so the headline never fights the tree glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[64%] bg-gradient-to-r from-background/95 via-background/80 to-transparent md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 pt-24 pb-20">
        <h1 className="font-display font-bold leading-[1.04] tracking-tight text-[clamp(2.5rem,6vw,4.4rem)] [text-shadow:0_2px_30px_rgba(11,10,18,0.9),0_1px_8px_rgba(11,10,18,0.8)]">
          <span className="block overflow-hidden pb-1">
            <motion.span custom={0} variants={rise} initial="hidden" animate="show" className="block">
              Made it for my own <span className="accent-serif">server</span>.
            </motion.span>
          </span>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="accent-serif mt-3 block text-[clamp(1.35rem,2.7vw,2rem)] text-primary/85"
          >
            then other servers wanted in.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg [text-shadow:0_1px_16px_rgba(11,10,18,0.9),0_0_4px_rgba(11,10,18,0.8)]"
        >
          B4NDX takes the small everyday jobs off your hands and doesn't ask
          for much in return. No dashboard to learn, no web account, nothing
          to set up before it's useful.{" "}
          <code className="rounded-md border border-border bg-[#221b36] px-1.5 py-0.5 font-mono text-[0.85em] text-[#b3a4ff]">
            !help
          </code>{" "}
          tells you everything it can do, and that list keeps growing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <AddButton />
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            or ask in the support server
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-8 text-[13px] text-muted-foreground/75"
        >
          Free. No premium tier, no ads, no paywalled commands.
        </motion.p>
      </div>
    </section>
  );
}
