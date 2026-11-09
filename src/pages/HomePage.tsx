import { Hero } from "../components/hero/Hero";
import { Overview } from "../components/sections/Overview";
import { Explorer } from "../components/sections/Explorer";
import { Install } from "../components/sections/Install";
import { Permissions } from "../components/sections/Permissions";
import { Faq } from "../components/sections/Faq";
import { SupportCta } from "../components/sections/SupportCta";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function HomePage() {
  useDocumentTitle(
    "B4NDX Utility — Discord utility bot for moderation, tickets, and server management",
  );

  return (
    <>
      <Hero />

      {/* The main content overlaps the pinned hero's final phase — a continuous
          hand-off instead of a hard cut. Opaque bg covers the stage. */}
      <div className="relative z-20 border-t border-line-1 bg-base-0 lg:-mt-[16vh]">
        <main
          id="content"
          className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:pt-24 lg:px-8 lg:pb-32"
        >
          <div className="space-y-24 lg:space-y-36">
            <section aria-label="Features">
              <Overview />
              <Explorer />
            </section>

            <Install />
            <Permissions />
            <Faq />

            <section aria-label="Support">
              <SupportCta />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
