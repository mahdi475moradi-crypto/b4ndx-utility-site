import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "B4NDX — a free Discord bot",
  description:
    "B4NDX is a free Discord bot that handles the everyday server stuff. No dashboard, no premium tier, no ads. Type !help and it tells you everything it can do.",
  openGraph: {
    title: "B4NDX — a free Discord bot",
    description:
      "Made for one server, now open to all of them. Free, no premium tier, no ads.",
    siteName: "B4NDX",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${bricolage.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
