import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { ArrowUpRight, CloseIcon, MenuIcon } from "./icons";
import { INVITE_URL, NAV_LINKS } from "../lib/site";

function NavArrow() {
  return <ArrowUpRight className="opacity-0 transition-opacity duration-150 group-hover:opacity-70" />;
}

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile dialog if the viewport crosses to desktop while open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setNavOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-1 bg-base-0/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-sm text-ink-2 transition-colors duration-150 hover:text-ink-1"
              >
                {link.label}
                <NavArrow />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-ink-2 transition-colors duration-150 hover:text-ink-1"
              >
                {link.label}
              </Link>
            ),
          )}
          <a
            href={INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary min-h-0 px-4 py-2"
          >
            Invite Bot
            <ArrowUpRight />
          </a>
        </nav>

        {/* Mobile trigger */}
        <button
          ref={menuButtonRef}
          type="button"
          className="btn-ghost min-h-0 border border-line-1 p-2.5 lg:hidden"
          aria-expanded={navOpen}
          aria-haspopup="dialog"
          aria-controls="mobile-nav"
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <MobileNav
        open={navOpen}
        onClose={() => {
          setNavOpen(false);
          menuButtonRef.current?.focus();
        }}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}
