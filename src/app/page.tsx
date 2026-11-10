"use client";

import dynamic from "next/dynamic";
import { Nav, Footer } from "@/components/bot/chrome";
import { Hero } from "@/components/bot/hero";
import { Demo } from "@/components/bot/demo";
import { Note } from "@/components/bot/note";
import { Faq, FinalCta } from "@/components/bot/faq";

const TreeScene = dynamic(() => import("@/components/bot/TreeScene"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* 3D purple tree + petals, fixed behind everything */}
      <TreeScene />

      {/* atmospheric overlays above the canvas, below the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,transparent_40%,rgba(11,10,18,0.55)_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E&quot;)]" />
      </div>

      <Nav />

      <main className="relative z-10 flex flex-1 flex-col">
        <Hero />
        <Demo />
        <Note />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
