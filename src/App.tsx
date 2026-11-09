import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useReducedMotion } from "./hooks/useMediaQuery";

/**
 * Scrolls to the anchor on hash navigation, resets scroll on route change.
 * Cloudflare's SPA fallback serves index.html for every route, so this
 * router fully owns /, /privacy, /terms — including refresh and deep links.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start",
          });
          return;
        }
        window.scrollTo(0, 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, reducedMotion]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[3px] focus:bg-rose-1 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-rose-ink"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
