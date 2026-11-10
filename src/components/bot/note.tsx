"use client";

import { motion } from "framer-motion";

export function Note() {
  return (
    <section aria-labelledby="note-heading" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl border-l-2 border-primary/30 pl-6 sm:pl-8"
        >
          <h2 id="note-heading" className="sr-only">
            Why B4NDX exists
          </h2>
          <p className="accent-serif text-base text-muted-foreground">why it exists</p>
          <div className="mt-5 space-y-5 text-[1.05rem] leading-relaxed text-foreground/85 sm:text-lg">
            <p>
              B4NDX started as a weekend project for one server. It did two
              or three things, badly.
            </p>
            <p>
              Then people kept asking for more. A welcome message here, a log
              there. At some point it stopped being a weekend project and
              quietly became a thing that gets maintained.
            </p>
            <p>
              There's no company behind this and nothing being sold. It's
              one person, one bot, and a support server full of people with
              opinions about what should get built next.
            </p>
          </div>
          <p className="accent-serif mt-6 text-base text-muted-foreground">
            — the person running it
          </p>
        </motion.div>
      </div>
    </section>
  );
}
