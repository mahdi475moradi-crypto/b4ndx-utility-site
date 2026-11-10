"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddButton } from "@/components/bot/chrome";
import { SUPPORT_URL } from "@/lib/bot";

const FAQS = [
  {
    q: "How do I add it to my server?",
    a: "Hit \"Add to Discord\", pick your server, approve the permissions. You need Manage Server for your server to show up in the list. Once it's in, !help works right away.",
  },
  {
    q: "What can it actually do?",
    a: "Type !help, genuinely. The command list lives inside the bot and keeps itself current, so anything written on this page would just go stale. Missing something? The support server takes requests.",
  },
  {
    q: "Does it work in threads?",
    a: "Commands work in threads and in voice channel chat. If you find a corner of Discord where they don't, that's a bug, and the support server wants to hear about it.",
  },
  {
    q: "Why ! and not just slash commands?",
    a: "Both work. The ! prefix exists because people type commands on instinct, and slash exists because it shows you the options as you go. Use whichever your muscle memory prefers.",
  },
  {
    q: "Is it really free?",
    a: "Really. No premium tier, no ads, no commands locked behind an upgrade screen. If that ever changes, the support server will hear about it first.",
  },
  {
    q: "Something's broken.",
    a: "Join the support server and say so. The person who broke it is the person who fixes it, so nothing disappears into a ticket queue.",
  },
  {
    q: "Can I remove it later?",
    a: "Any time. Kick it like any other member and it takes its data with it. No lingering hooks, no goodbye email.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="accent-serif text-base text-muted-foreground">questions</p>
            <h2 id="faq-heading" className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              The things people <span className="accent-serif">actually</span> ask.
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Short answers. If yours isn't here,{" "}
              <a
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
              >
                the support server
              </a>{" "}
              knows it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left font-display text-base font-semibold hover:text-primary hover:no-underline sm:text-lg [&[data-state=open]]:text-primary">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative z-10 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Find out in <span className="accent-serif">thirty seconds</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 max-w-md text-muted-foreground sm:text-lg"
        >
          That's roughly how long adding it takes. If it turns out not to be
          useful, removing it is even quicker. No hard feelings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
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
      </div>
    </section>
  );
}
